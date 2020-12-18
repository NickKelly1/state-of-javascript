import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDownSharp';
import {
  Box,
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
} from "@material-ui/core";
import dayjs from 'dayjs';
import { gql } from "graphql-request";
import React, { Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Column,
  useTable } from "react-table";
import { ApiException } from "../../backend-api/api.exception";
import {
  UsersTableDataQuery,
  UsersTableDataQueryVariables,
  UsersTableDeleteMutation,
  UsersTableDeleteMutationVariables,
} from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { OrUndefined } from "../../types/or-undefined.type";
import { NextRouter, useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import { IUseDialogReturn, useDialog } from '../../hooks/use-dialog.hook';
import { IIdentityFn } from '../../types/identity-fn.type';
import { WithMemo } from '../../components-hoc/with-memo/with-memo';
import { flsx } from '../../helpers/flsx.helper';
import { UserMutateFormDialog } from './user-mutate.form.dialog';
import { UserTabs } from './user.tabs';
import { JsonDialog } from '../debug-json-dialog/json-dialog';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { hidex } from '../../helpers/hidden.helper';
import { WithLoadable } from '../../components-hoc/with-loadable/with-loadable';
import { ExceptionButton } from '../exception-button/exception-button.helper';

const UsersTableDataQueryName = 'UsersTableDataQuery'
const usersTableDataQuery = gql`
query UsersTableData(
  $offset:Int!
  $limit:Int!
){
  users(
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
        softDelete
        hardDelete
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


const usersTableDeleteMutation = gql`
mutation UsersTableDelete(
  $id:Int!
){
  softDeleteUser(
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


const defaultQueryVariables: UsersTableDataQueryVariables = {
  offset: 0,
  limit: PerPageOptions._30,
};


export interface IUsersTableProps {
  limit?: number;
  offset?: number;
}


export const UsersTable = WithApi<IUsersTableProps>((props) => {
  const { limit, offset, api, me, } = props;
  const vars = useMemo((): UsersTableDataQueryVariables => ({
    limit: limit ?? defaultQueryVariables.limit,
    offset: offset ?? defaultQueryVariables.offset,
  }), [limit, offset])
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<any, ApiException>(
    [UsersTableDataQueryName, vars, me.hash],
    async (): Promise<UsersTableDataQuery> => {
      const result = await api.gql<UsersTableDataQuery, UsersTableDataQueryVariables>(
        usersTableDataQuery,
        vars,
      );
      return result;
    },
    {
      keepPreviousData: true,
    },
  );

  return (
    <WithLoadable isLoading={isLoading} error={error} data={data}>
      {(data) => (
        <UsersTableContent
          queryData={data}
          refetch={refetch}
        />
      )}
    </WithLoadable>
  );
});

interface IUsersTableContentProps {
  queryData: UsersTableDataQuery;
  refetch?: IIdentityFn;
}


const useRolesTableContentStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

const UsersTableContent = WithApi<IUsersTableContentProps>((props) => {
  const { queryData, refetch, api, me, } = props;
  const classes = useRolesTableContentStyles();
  const router: NextRouter = useRouter();
  const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((evt) => {
    const nextLimit = evt.target.value;
    router.push({ query: { ...router.query, limit: encodeURI(nextLimit), } });
  }, [router])
  const handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void = useCallback((evt, page) => {
    const limit = queryData.users.pagination.limit;
    // mui 0 indexes page
    const nextOffset = page * limit;
    router.push({ query: { ...router.query, offset: encodeURI(nextOffset.toString()), }, });
  }, [router, queryData.users.pagination])

  type IOpenState = Record<Id, OrUndefined<boolean>>;
  const [open, setOpen] = useState<IOpenState>({});

  interface IUserRow {
    id: Id;
    name: string;
    updated_at: string;
    created_at: string;
    deleted_at: string;
    canHardDelete: boolean;
  }

  const tableData = useMemo<IUserRow[]>((): IUserRow[] => {
    return queryData
      .users
      .nodes
      .filter(ist.notNullable)
      .map((node): IUserRow => {
        return {
          id: node.data.id,
          name: node.data.name,
          created_at: dayjs(node.data.created_at).format('YYYY-M-D hh:mm:ss'),
          updated_at: dayjs(node.data.updated_at).format('YYYY-M-D hh:mm:ss'),
          deleted_at: node.data.deleted_at ? dayjs(node.data.deleted_at).format('YYYY-M-D hh:mm:ss') : '',
          canHardDelete: node.can.hardDelete,
        };
      });
  }, [queryData]);

  const [doDelete, doDeleteState] = useMutation<UsersTableDeleteMutation, ApiException, UsersTableDeleteMutationVariables>(
    async (vars: UsersTableDeleteMutationVariables): Promise<UsersTableDeleteMutation> => {
      const result = await api.gql<UsersTableDeleteMutation, UsersTableDeleteMutationVariables>(
        usersTableDeleteMutation,
        vars,
      );
      return result;
    },
    { onSuccess: refetch, },
  );

  const columns = useMemo<Column<IUserRow>[]>(() => {
    const cols: Column<IUserRow>[] = [{
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
    const canDeleteSome = tableData.some(dat => dat.canHardDelete);
    if (canDeleteSome) {
      cols.push({
        Header: 'Delete',
        accessor: (original) => (
          <IconButton
            color="primary"
            disabled={!original.canHardDelete}
            onClick={() => doDelete({ id: Number(original.id) })}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        ),
      });
    }
    return cols;
  }, [ open, doDelete, queryData, ]);

  const tableInstance = useTable({ columns, data: tableData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const createDialog: IUseDialogReturn = useDialog();
  const handleCreated: IIdentityFn = useCallback(() => flsx(refetch, createDialog.doClose)(), [refetch, createDialog.doClose]);

  const debugDialog = useDialog();
  const debugData = useMemo(() => ({ queryData, tableData, }), [queryData, tableData]);

  return (
    <>
      <JsonDialog title="Users" dialog={debugDialog} data={debugData} />
      <UserMutateFormDialog dialog={createDialog} onSuccess={handleCreated} />
      {/* create user dialog */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={1}>
              <Typography component="h1" variant="h1">
                Users
              </Typography>
            </Box>
            <Box className={hidex(!queryData.users.can.create)}>
              <Box pr={1}>
                <IconButton color="primary" onClick={createDialog.doOpen}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
            <WhenDebugMode>
              <Box pr={1}>
                <IconButton color="primary" onClick={debugDialog.doOpen}>
                  <BugReportIcon />
                </IconButton>
              </Box>
            </WhenDebugMode>
            {doDeleteState.isLoading && (
              <Box pr={1} className="centered">
                <CircularProgress />
              </Box>
            )}
            {doDeleteState.error && (
              <Box pr={1} className="centered">
                <ExceptionButton
                  message={`Errored deleting user: ${doDeleteState.error.message}`}
                  exception={doDeleteState.error}
                />
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
                                    <UserTabs onStale={refetch} user_id={row.original.id} />
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
                        .concat(queryData.users.pagination.limit))
                      )
                      .sort((a, b) => a - b)
                  }}
                  deps={[queryData.users.pagination.limit, queryData.users.pagination]}
                >
                  {(perPage) => (
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={perPage}
                      count={queryData.users.pagination.total}
                      page={queryData.users.pagination.page_number - 1}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      rowsPerPage={queryData.users.pagination.limit}
                    />
                  )}
                </WithMemo>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
})
