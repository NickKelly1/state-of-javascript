import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import dayjs from 'dayjs';
import { gql } from "graphql-request";
import React, { Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Column,
  useTable } from "react-table";
import { Api } from "../../backend-api/api";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { Cms } from "../../cms/cms";
import {
  RolesTableDataQuery,
  RolesTableDataQueryVariables, 
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
import { Id } from "../../types/id.type";
import { OrUndefined } from "../../types/or-undefined.type";
import { NextRouter, useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import { RoleSection } from '../../components/roles/role.section';
import { ApiContext } from '../../components-contexts/api.context';
import { DebugException } from '../../components/debug-exception/debug-exception';
import { ParsedUrlQuery } from 'querystring';
import { OrNullable } from '../../types/or-nullable.type';
import { IUseDialogReturn, useDialog } from '../../hooks/use-dialog.hook';
import { RoleMutateFormDialog } from '../../components/roles/role-mutate.form.dialog';
import { IIdentityFn } from '../../types/identity-fn.type';
import { WithMemo } from '../../components-hoc/with-memo/with-memo';

const RolesTableDataQueryName = 'RolesTableDataQuery'
const rolesTableDataQuery = gql`
query RolesTableData(
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

const defaultQueryVariables: RolesTableDataQueryVariables = {
  offset: 0,
  limit: PerPageOptions._30,
};


function getVars(query: OrNullable<ParsedUrlQuery>): RolesTableDataQueryVariables {
  let offset: number;
  if (ist.notNullable(query?.offset)) offset = Number(query?.offset);
  else offset = defaultQueryVariables.offset;
  let limit: number;
  if (ist.notNullable(query?.limit)) limit = Number(query?.limit);
  else limit = defaultQueryVariables.limit;
  return { offset, limit, }
}

export interface IRolesTableProps {
  limit?: number;
  offset?: number;
}

export function RolesTable(props: IRolesTableProps) {
  const { limit, offset } = props;
  const router: NextRouter = useRouter();
  const { api, me } = useContext(ApiContext);
  const vars = useMemo((): RolesTableDataQueryVariables => ({
    limit: limit ?? defaultQueryVariables.limit,
    offset: offset ?? defaultQueryVariables.offset,
  }), [limit, offset])
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchMore,
  } = useQuery<RolesTableDataQuery, ApiException>(
    [RolesTableDataQueryName, vars, me?.hash],
    async (): Promise<RolesTableDataQuery> => {
      const result = await api
        .connector
        .graphql<RolesTableDataQuery, RolesTableDataQueryVariables>(rolesTableDataQuery, vars)
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
          <RolesTableContent
            refetch={refetch}
            rolesQuery={data}
          />
        </Grid>
      )}
    </Grid>
  );
}

interface IRolesTableContentRefetchFn { (): any; }
interface IRolesTableContentProps {
  rolesQuery: RolesTableDataQuery;
  refetch?: IRolesTableContentRefetchFn;
}


const useRolesTableContentStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

function RolesTableContent(props: IRolesTableContentProps) {
  const { rolesQuery, refetch } = props;
  const { api, me } = useContext(ApiContext);
  const classes = useRolesTableContentStyles();
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
          // <Box>
            <IconButton
              color="primary"
              disabled={!original.canDelete}
              onClick={() => doDelete({ id: Number(original.id) })}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          // </Box>
        ),
      });
    }
    return cols;
  }, [ open, doDelete, rolesQuery, ]);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  const createRoleDialog: IUseDialogReturn = useDialog();

  const handleRoleCreated: IIdentityFn = useCallback(() => {
    refetch?.();
    createRoleDialog.doClose();
  }, [refetch, createRoleDialog.doClose]);

  return (
    <>
      <RoleMutateFormDialog dialog={createRoleDialog} onSuccess={handleRoleCreated} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={1}>
              <Typography component="h1" variant="h1">
                Roles
              </Typography>
            </Box>
            {rolesQuery.roles.can.create && (
              <Box pr={1}>
                <IconButton color="primary" onClick={createRoleDialog.doOpen}>
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
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
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
