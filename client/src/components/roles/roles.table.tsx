import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
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
import { RoleTabs } from './role.tabs';
import { ApiContext } from '../../components-contexts/api.context';
import { DebugException } from '../../components/debug-exception/debug-exception';
import { ParsedUrlQuery } from 'querystring';
import { OrNullable } from '../../types/or-nullable.type';
import { IUseDialogReturn, useDialog } from '../../hooks/use-dialog.hook';
import { RoleMutateFormDialog } from '../../components/roles/role-mutate.form.dialog';
import { IIdentityFn } from '../../types/identity-fn.type';
import { WithMemo } from '../../components-hoc/with-memo/with-memo';
import { flsx } from '../../helpers/flsx.helper';
import { DebugJsonDialog } from '../debug-json-dialog/debug-json-dialog';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { hidex } from '../../helpers/hidden.helper';

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


const roleTableDeleteMutation = gql`
mutation RoleTableDelete(
  $id:Int!
){
  softDeleteRole(
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


export interface IRolesTableProps {
  limit?: number;
  offset?: number;
}


export const RolesTable = WithApi<IRolesTableProps>((props) => {
  const { limit, offset, api, me } = props;
  const vars = useMemo((): RolesTableDataQueryVariables => ({
    limit: limit ?? defaultQueryVariables.limit,
    offset: offset ?? defaultQueryVariables.offset,
  }), [limit, offset])
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<RolesTableDataQuery, ApiException>(
    [RolesTableDataQueryName, vars, me.hash],
    async (): Promise<RolesTableDataQuery> => {
      const result = await api.gql<RolesTableDataQuery, RolesTableDataQueryVariables>(
        rolesTableDataQuery,
        vars,
      );
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
            queryData={data}
          />
        </Grid>
      )}
    </Grid>
  );
});

interface IRolesTableContentRefetchFn { (): any; }
interface IRolesTableContentProps {
  queryData: RolesTableDataQuery;
  refetch?: IRolesTableContentRefetchFn;
}


const useRolesTableContentStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

const RolesTableContent = WithApi<IRolesTableContentProps>((props) => {
  const { queryData, refetch, api, me, } = props;
  const classes = useRolesTableContentStyles();
  const router: NextRouter = useRouter();
  const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((evt) => {
    const nextLimit = evt.target.value;
    router.push({ query: { ...router.query, limit: encodeURI(nextLimit), } });
  }, [router])
  const handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void = useCallback((evt, page) => {
    const limit = queryData.roles.pagination.limit;
    // mui 0 indexes page
    const nextOffset = page * limit;
    router.push({ query: { ...router.query, offset: encodeURI(nextOffset.toString()), }, });
  }, [router, queryData.roles.pagination])

  type IOpenState = Record<Id, OrUndefined<boolean>>;
  const [open, setOpen] = useState<IOpenState>({});

  interface IRoleRow {
    id: Id;
    name: string;
    updated_at: string;
    created_at: string;
    deleted_at: string;
    canHardDelete: boolean;
  }

  const tableData = useMemo<IRoleRow[]>((): IRoleRow[] => {
    return queryData
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
          canHardDelete: node.can.hardDelete,
        };
      });
  }, [queryData]);

  const handleDeleteCb = useCallback(async (vars: RoleTableDeleteMutationVariables): Promise<RoleTableDeleteMutation> => {
    const result = await api.gql<RoleTableDeleteMutation, RoleTableDeleteMutationVariables>(
      roleTableDeleteMutation,
      vars,
    );
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
      <DebugJsonDialog title="Roles" dialog={debugDialog} data={debugData} />
      <RoleMutateFormDialog dialog={createDialog} onSuccess={handleCreated} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={1}>
              <Typography component="h1" variant="h1">
                Roles
              </Typography>
            </Box>
            <Box className={hidex(!me.can?.roles.create)}>
              <Box mr={1}>
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
                                    <RoleTabs onStale={refetch} role_id={row.original.id} />
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
                        .concat(queryData.roles.pagination.limit))
                      )
                      .sort((a, b) => a - b)
                  }}
                  deps={[queryData.roles.pagination.limit, queryData.roles.pagination]}
                >
                  {(perPage) => (
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={perPage}
                      count={queryData.roles.pagination.total}
                      page={queryData.roles.pagination.page_number - 1}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      rowsPerPage={queryData.roles.pagination.limit}
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
});
