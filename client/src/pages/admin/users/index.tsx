import { gql, request, GraphQLClient } from 'graphql-request';
import React, { useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Column, ColumnGroup, useTable } from 'react-table';
import { IPermissionRo } from '../../../backend-api/services/permission/dtos/permission.ro';
import { IApiCollection } from '../../../backend-api/types/api-collection.interface';
import { pretty } from '../../../helpers/pretty.helper';
import { serverSidePropsHandler } from "../../../helpers/server-side-props-handler.helper";
import {
  Box,
  Collapse,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDownSharp';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../contexts/api.context';
import { OrUndefined } from '../../../types/or-undefined.type';
import { graphql } from 'graphql';

// const pageQuery = gql`
// query AdminUsersPage{
//   users(
//     options:{
//       offset:0
//       limit:15
//     }
//   ){
//     meta{
//       limit
//       offset
//       total
//       page_number
//       pages
//       more
//     }
//     edges{
//       node{
//         id
//         name
//         created_at
//         updated_at
//         deleted_at
//         userRoleConnection(
//           options:{
//             offset:0
//             limit:15
//           }
//         ){
//           meta{
//             limit
//             offset
//             total
//             page_number
//             pages
//             more
//           }
//           edges{
//             node{
//               id
//               user_id
//               role_id
//               created_at
//               updated_at
//               user{
//                 node{
//                   id
//                   name
//                 }
//               }
//               role{
//                 node{
//                   id
//                   name
//                   rolePermissionConnection(
//                     options:{
//                       offset:0
//                       limit:15
//                     }
//                   ){
//                     meta{
//                       limit
//                       offset
//                       total
//                       page_number
//                       pages
//                       more
//                     }
//                     edges{
//                       node{
//                         id
//                         role_id
//                         permission_id
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
// 	}
// }
// `

const useRowStyles = makeStyles({
  centered: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export interface IAdminUsersPageProps {
  users: IApiCollection<IUserRo>;
  roles: IApiCollection<IRoleRo>;
  userRoles: IApiCollection<IUserRoleRo>;
  rolePermissions: IApiCollection<IRolePermissionRo>;
  permissions: IApiCollection<IPermissionRo>;
}

interface IUserRow {
  id: UserId;
  name: string;
  updated_at: string;
  created_at: string;
}

function AdminUsersPage(props: IAdminUsersPageProps) {
  const { users } = props;

  const [open, setOpen] = useState<Record<UserId, OrUndefined<boolean>>>({});
  const data = useMemo<IUserRow[]>(() => users.data.map((user): IUserRo => ({
    id: user.id,
    name: user.name,
    updated_at: dayjs(user.updated_at).format('YYYY-M-D hh:mm:ss'),
    created_at: dayjs(user.created_at).format('YYYY-M-D hh:mm:ss'),
  })), users.data);

  const columns = useMemo<Column<IUserRo>[]>(() => [
    {
      id: 'expand_chevron',
      // Header: 'durrr',
      accessor: (original, index, table) => (
        <IconButton color="inherit" aria-label="expand row" size="small" onClick={() => setOpen((prev) => ({ ...prev, [original.id]: !prev[original.id] }))}>
          {!open[original.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      ),
    },
    {
      Header: 'Id',
      accessor: 'id'
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Created',
      accessor: 'created_at'
    },
    {
      Header: 'Updated',
      accessor: 'updated_at'
    },
  ], [open]);

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div>
      <div>
        {/* <CollapsibleTable /> */}
      </div>
      <div>
        <h1>
          table
        </h1>

        <TableContainer>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TableCell {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                return (
                  <React.Fragment key={key}>
                    <TableRow {...rowProps}>
                      {row.cells.map(cell => (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow {...rowProps}>
                      <TableCell colSpan={row.cells.length} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={!!open[row.original.id]} timeout="auto" unmountOnExit>
                          <UserAuthorizationSubsection user={row.original} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <h1>
        data
      </h1>
      <pre>
        {pretty(props)}
      </pre>
    </div>
  );
}

interface IUserAuthorizationSubsection {
  user: IUserRo;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    centered: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

function UserAuthorizationSubsection(props: IUserAuthorizationSubsection) {
  const { user } = props;
  const { api } = useContext(ApiContext);
  const classes = useStyles();

  interface IPersonalised {
    roles: IApiCollection<IRoleRo>;
    userRoles: IApiCollection<IUserRoleRo>;
    permissions: IApiCollection<IPermissionRo>;
    rolePermissions: IApiCollection<IRolePermissionRo>;
  }

  interface IAll {
    // roles: IApiCollection<IRoleRo>;
    // permissions: IApiCollection<IRoleRo>;
  }

  interface IData {
    all: IAll;
    personalised: IPersonalised;
  }

  const { data, error, isLoading } = useQuery(
    null,
    async () => {
      const personalisedP = (async () => {
        const hasUserRoles = await api.services.userRoles.findMany({ query: {
          offset: 0,
          limit: 200,
          filter: { _attr: { user_id: { _val: { _eq: { _val: user.id, } } } } }
        }});

        const [hasRoles, hasRolePermissions] = await Promise.all([
          api.services.roles.findMany({ query: {
            offset: 0,
            limit: 200,
            filter: { _attr: { id: { _val: { _in: { _val: hasUserRoles.data.map(ur => ur.role_id) } } }, } },
          } }),
          api.services.rolePermissions.findMany({ query: {
            offset: 0,
            limit: 200,
            filter: { _attr: { role_id: { _val: { _in: { _val: hasUserRoles.data.map(ur => ur.role_id) } } }, } },
          }}),
        ]);

        const hasPermissions = await api.services.permissions.findMany({ query: {
          offset: 0,
          limit: 200,
          filter: { _attr: {
            id: { _val: { _in: { _val: hasRolePermissions.data.map(rp => rp.permission_id) } } }
          }},
        }});

        const result: IPersonalised = {
          permissions: hasPermissions,
          userRoles: hasUserRoles,
          rolePermissions: hasRolePermissions,
          roles: hasRoles,
        };
        return result;
      })();

      // const allP = (async () => {
      //   const [roles, permissions] = await Promise.all([
      //     api.services.roles.findMany({ query: { offset: 0, limit: 200, filter: undefined, } }),
      //     api.services.permissions.findMany({ query: { offset: 0, limit: 200, filter: undefined, } }),
      //   ]);
      //   const result: IAll = { roles, permissions };
      //   return result;
      // })();

      const [
        personalised,
        // all,
      ] = await Promise.all([
        personalisedP,
        // allP,
      ]);
      const result: IData = {
        personalised,
        // all
        all: {
          // permissions: [],
          // roles: [],
        },
      };
      return result;
    },
    { retry: false },
  );

  if (!isLoading && error) return <div><div>error</div><pre>{pretty(error)}</pre></div>;
  if (isLoading || !data) return <div>loading...</div>

  return (
    <>
      <Typography>
        Roles
      </Typography>
      <List>
        {data.personalised.roles.data.map((role) => (
          <ListItem key={role.id} button>
            <ListItemText primary={role.name} />
          </ListItem>
        ))}
      </List>
      <Typography>
        Permissions
      </Typography>
      <List>
        {data.personalised.permissions.data.map((perm) => (
          <ListItem key={perm.id} button>
            <ListItemText primary={perm.name} />
          </ListItem>
        ))}
      </List>
      <div>
        data:
      </div>
      <pre>
        {pretty(data)}
      </pre>
    </>
  )
}

export const getServerSideProps = serverSidePropsHandler<IAdminUsersPageProps>(async ({ ctx, cms, npmsApi, api }) => {
  const [
    users,
    roles,
    userRoles,
    rolePermissions,
    permissions,
  ] = await Promise.all([
    api.services.users.findMany({}),
    api.services.roles.findMany({}),
    api.services.userRoles.findMany({}),
    api.services.rolePermissions.findMany({}),
    api.services.permissions.findMany({}),
  ]);

  const props: IAdminUsersPageProps = {
    users,
    roles,
    userRoles,
    rolePermissions,
    permissions,
  };

  return {
    props,
    // revalidate: false,
  };
});

export default AdminUsersPage;