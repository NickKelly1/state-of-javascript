import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import SwipeableViews from 'react-swipeable-views';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDownSharp';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@material-ui/core";
import dayjs from 'dayjs';
import { gql } from "graphql-request";
import React, { Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Column,
  useTable } from "react-table";
import { Api } from "../../backend-api/api";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { Cms } from "../../cms/cms";
import { RolesPageQuery,
  RolesPageQueryVariables, 
  RoleTableDeleteMutation,
  RoleTableDeleteMutationVariables,
} from "../../generated/graphql";
import {
  Attempt,
  attemptAsync,
  isFail,
  isSuccess,
} from "../../helpers/attempted.helper";
import { ist } from "../../helpers/ist.helper";
import {
  staticPropsHandler,
  staticPathsHandler,
} from "../../helpers/static-props-handler.helper";
import { NpmsApi } from "../../npms-api/npms-api";
import { Id } from "../../types/id.type";
import { OrUndefined } from "../../types/or-undefined.type";
import { JsonPretty } from '../../components/json-pretty/json-pretty';
import { NextRouter, useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { serverSidePropsHandler } from '../../helpers/server-side-props-handler.helper';
import { WithMemo } from '../../components/with-memo/with-memo';
import { TabGroup } from '../../components/tab-group/tab-group';
import clsx from 'clsx';
import { IRoleRolePermissionFormProps, RoleRolePermissionForm } from '../../components/role-role-permissions-form/role.form';
import { formatRelative } from 'date-fns';
import { RoleSection } from '../../components/role-section/role-section';
import { ApiContext } from '../../contexts/api.context';
import { DebugException } from '../../components/debug-exception/debug-exception';
import { useUpdate } from '../../hooks/use-update.hook';
import { ParsedUrlQuery } from 'querystring';
import { OrNullable } from '../../types/or-nullable.type';
import { IMeHash } from '../../backend-api/api.me';

const RolesPageQueryName = 'RolesPageQuery'
const rolesPageQuery = gql`
query RolesPage(
  $limit:Int!
  $offset:Int!
){
  roles(
    query:{
      offset:$offset
      limit:$limit
    }
  ){
    pagination{
      limit
      offset
      total
      page_number
      pages
      more
    }
    can{
      show
			create
    }
    nodes{
      can{
        show
        update
        delete
      }
      data{
        id
        name
        created_at
        updated_at
        deleted_at
      }
    }
  }
}
`;


const roleTableDeleteMutation = gql`
mutation RoleTableDelete(
  $id:Int!
){
  deleteRole(
    dto:{
      id:$id
		}
  )
}
`;


const PerPageOptions = {
  _5: 5,
  _10: 10,
  _30: 30,
  _50: 50,
  _100: 100,
};

const defaultQueryVariables: RolesPageQueryVariables = {
  offset: 0,
  limit: PerPageOptions._30,
};


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

interface IRolesPageProps {
  //
}

function getVars(query: OrNullable<ParsedUrlQuery>): RolesPageQueryVariables {
  let offset: number;
  if (ist.notNullable(query?.offset)) offset = Number(query?.offset);
  else offset = defaultQueryVariables.offset;

  let limit: number;
  if (ist.notNullable(query?.limit)) limit = Number(query?.limit);
  else limit = defaultQueryVariables.limit;

  return { offset, limit, }
}

function RolesPage(props: IRolesPageProps) {
  const classes = useStyles();
  const router: NextRouter = useRouter();
  const { api, me } = useContext(ApiContext);

  const vars = useMemo(() => getVars(router.query), [router.query])
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchMore,
  } = useQuery<RolesPageQuery, ApiException>(
    [RolesPageQueryName, vars, me?.hash],
    async (): Promise<RolesPageQuery> => {
      const result = await api
        .connector
        .graphql<RolesPageQuery, RolesPageQueryVariables>(rolesPageQuery, vars)
        .catch(rethrow(normaliseApiException));
      return result;
    },
    {
      keepPreviousData: true,
    },
  );

  return (
    <Grid container spacing={2}>
      {error && (
        <Grid item xs={12}>
          <DebugException centered always exception={error} />
        </Grid>
      )}
      {isLoading && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {data && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <RolesPageContent
              refetch={refetch}
              rolesQuery={data}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

interface IRolesPageContentRefetchFn { (): any; }
interface IRolesPageContentProps {
  rolesQuery: RolesPageQuery;
  refetch?: IRolesPageContentRefetchFn;
}

function RolesPageContent(props: IRolesPageContentProps) {
  const { rolesQuery, refetch } = props;

  const { api, me } = useContext(ApiContext);
  const router: NextRouter = useRouter();
  const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((evt) => {
    const nextLimit = evt.target.value;
    router.push({ query: { ...router.query, limit: encodeURI(nextLimit), } });
  }, [router])
  const handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void = useCallback((evt, page) => {
    const limit = rolesQuery.roles.pagination.limit;
    // mui 0 indexes page
    const nextOffset = page * limit;
    router.push({ query: { ...router.query, offset: encodeURI(nextOffset.toString()), }, });
  }, [router, rolesQuery.roles.pagination])

  type IOpenState = Record<Id, OrUndefined<boolean>>;
  const [open, setOpen] = useState<IOpenState>({});

  interface IRoleRow {
    id: Id;
    name: string;
    updated_at: string;
    created_at: string;
    deleted_at: string;
    canDelete: boolean;
  }

  const data = useMemo<IRoleRow[]>((): IRoleRow[] => {
    return rolesQuery
      .roles
      .nodes
      .filter(ist.notNullable)
      .map((node): IRoleRow => {
        return {
          id: node.data.id,
          name: node.data.name,
          created_at: dayjs(node.data.created_at).format('YYYY-M-D hh:mm:ss'),
          updated_at: dayjs(node.data.updated_at).format('YYYY-M-D hh:mm:ss'),
          deleted_at: node.data.deleted_at ? dayjs(node.data.deleted_at).format('YYYY-M-D hh:mm:ss') : '',
          canDelete: node.can.delete,
        };
      });
  }, [rolesQuery]);

  const handleDeleteCb = useCallback(async (vars: RoleTableDeleteMutationVariables): Promise<RoleTableDeleteMutation> => {
    const result = await api
      .connector
      .graphql<RoleTableDeleteMutation, RoleTableDeleteMutationVariables>(
        roleTableDeleteMutation,
        vars,
      )
      .catch(rethrow(normaliseApiException));
    return result;
  }, [api, me,]);
  const [doDelete, doDeleteState] = useMutation<RoleTableDeleteMutation, ApiException, RoleTableDeleteMutationVariables>(
    handleDeleteCb,
    { onSuccess: refetch }
  );

  const columns = useMemo<Column<IRoleRow>[]>(() => {
    const cols: Column<IRoleRow>[] = [{
        id: 'expand_chevron',
        accessor: (original, index, table) => (
          <IconButton color="inherit" size="small" onClick={() => setOpen((prev) => ({ ...prev, [original.id]: !prev[original.id] }))}>
            {!open[original.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        ),
      }, {
        Header: 'Id',
        accessor: 'id',
      }, {
        Header: 'Name',
        accessor: 'name',
      }, {
        Header: 'Created',
        accessor: (original) => formatRelative(new Date(original.created_at), new Date()),
      }, {
        Header: 'Updated',
        accessor: (original) => formatRelative(new Date(original.updated_at), new Date()),
      }, {
        Header: 'Deleted',
        accessor: (original) => original.deleted_at
          ? formatRelative(new Date(original.deleted_at), new Date())
          : '',
    }];
    const canDeleteSome = data.some(dat => dat.canDelete);
    if (canDeleteSome) {
      cols.push({
        Header: 'Delete',
        accessor: (original) => (
          <Box>
            <Button disabled={!original.canDelete} onClick={() => doDelete({ id: Number(original.id) })}>
              <DeleteIcon />
            </Button>
          </Box>
        ),
      });
    }
    return cols;
  }, [ open, doDelete, rolesQuery, ]);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">
          Roles
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map(hg => (
                <TableRow {...hg.getHeaderGroupProps()}>
                  {hg.headers.map(col => (
                    <TableCell {...col.getHeaderProps()}>
                      {col.render('Header')}
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
                  <Fragment key={key}>
                    <TableRow {...rowProps}>
                      {row.cells.map(cell => (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow {...rowProps} className={clsx(rowProps.className, 'tabs-row')}>
                      <TableCell className="tabs-cell" colSpan={row.cells.length}>
                        <Collapse in={!!open[row.original.id]} timeout="auto" unmountOnExit>
                          <Box mb={2}>
                            <RoleSection role_id={row.original.id} />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <WithMemo<number[]>
          memo={() => {
            return Array
              .from(new Set(Object
                .values(PerPageOptions)
                .concat(rolesQuery.roles.pagination.limit))
              )
              .sort((a, b) => a - b)
          }}
          deps={[rolesQuery.roles.pagination.limit, rolesQuery.roles.pagination]}
        >
          {(perPage) => (
            <TablePagination
              component="div"
              rowsPerPageOptions={perPage}
              count={rolesQuery.roles.pagination.total}
              page={rolesQuery.roles.pagination.page_number - 1}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              rowsPerPage={rolesQuery.roles.pagination.limit}
            />
          )}
        </WithMemo>
      </Grid>
      {doDeleteState.isLoading && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      <Grid item xs={12}>
        <DebugException centered always exception={doDeleteState.error} />
      </Grid>
    </Grid>
  );
}

// async function runPageDataQuery(
//   api: Api,
//   vars: RolesPageQueryVariables,
// ): Promise<Attempt<RolesPageQuery, ApiException>> {
//   return attemptAsync(
//     api
//       .connector
//       .graphql<RolesPageQuery, RolesPageQueryVariables>(rolesPageQuery, vars),
//     normaliseApiException,
//   );
// }

// async function getProps(args: { cms: Cms; npmsApi: NpmsApi; api: Api; vars: RolesPageQueryVariables; }): Promise<IRolesPageProps> {
//   const { cms, npmsApi, api, vars } = args
//   const rolesQueryAttempt = await runPageDataQuery(api, vars);
//   return { rolesQueryAttempt, }
// }

// export const getServerSideProps = serverSidePropsHandler<IRolesPageProps>(async ({ ctx, cms, npmsApi, api, }) => {
//   // const query = ctx.query;
//   // const vars: RolesPageQueryVariables = {
//   //   offset: ist.notNullable(query?.offset) ? Number(query?.offset) : defaultQueryVariables.offset,
//   //   limit: ist.notNullable(query?.limit) ? Number(query?.limit) : defaultQueryVariables.limit,
//   // };
//   // const props = await getProps({ cms, npmsApi, api, vars, });
//   // return { props, };
//   return { props: {} };
// });


export default RolesPage;
