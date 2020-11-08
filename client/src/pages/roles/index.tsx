import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDownSharp';
import {
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
import { Api } from "../../backend-api/api";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException } from "../../backend-api/normalise-api-exception.helper";
import { Cms } from "../../cms/cms";
import { RolesPageQuery,
  RolesPageQueryVariables } from "../../generated/graphql";
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
import { useQuery } from 'react-query';
import { serverSidePropsHandler } from '../../helpers/server-side-props-handler.helper';
import { WithMemo } from '../../components/with-memo/with-memo';


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

const PerPageOptions = {
  _1: 1,
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
  rolesQueryAttempt: Attempt<RolesPageQuery, ApiException>;
}

function RolesPage(props: IRolesPageProps) {
  const { rolesQueryAttempt } = props;
  const classes = useStyles();

  const router: NextRouter = useRouter();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {isFail(rolesQueryAttempt) && <JsonPretty src={rolesQueryAttempt.value} />}
          {isSuccess(rolesQueryAttempt) && <RolesPageContent rolesQuery={rolesQueryAttempt.value} />}
        </Paper>
      </Grid>
    </Grid>
  );
}


interface IRolesPageContentProps {
  rolesQuery: RolesPageQuery;
}

function RolesPageContent(props: IRolesPageContentProps) {
  const { rolesQuery } = props;

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
        };
      });
  }, [rolesQuery]);

  const columns = useMemo<Column<IRoleRow>[]>(() => [{
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
      accessor: 'created_at',
    }, {
      Header: 'Updated',
      accessor: 'updated_at',
    }, {
      Header: 'Deleted',
      accessor: 'deleted_at',
  }], [open]);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
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
                    <TableRow {...rowProps}>
                      <TableCell colSpan={row.cells.length} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={!!open[row.original.id]} timeout="auto" unmountOnExit>
                          <div>
                            muh nuts
                          </div>
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
        {console.log(rolesQuery.roles.pagination)}
        <WithMemo<number[]>
          memo={() => Array.from(new Set(Object
              .values(PerPageOptions)
              .concat(rolesQuery.roles.pagination.limit))
          ).sort((a, b) => a - b)}
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
    </Grid>
  );
}

async function runPageDataQuery(
  api: Api,
  vars: RolesPageQueryVariables,
): Promise<Attempt<RolesPageQuery, ApiException>> {
  return attemptAsync(
    api
      .connector
      .graphql<RolesPageQuery, RolesPageQueryVariables>(rolesPageQuery, vars),
    normaliseApiException,
  );
}

async function getProps(args: { cms: Cms; npmsApi: NpmsApi; api: Api; vars: RolesPageQueryVariables; }): Promise<IRolesPageProps> {
  const { cms, npmsApi, api, vars } = args
  const rolesQueryAttempt = await runPageDataQuery(api, vars);
  return { rolesQueryAttempt, }
}

export const getServerSideProps = serverSidePropsHandler<IRolesPageProps>(async ({ ctx, cms, npmsApi, api, }) => {
  const query = ctx.query;
  const vars: RolesPageQueryVariables = {
    offset: ist.notNullable(query?.offset) ? Number(query?.offset) : defaultQueryVariables.offset,
    limit: ist.notNullable(query?.limit) ? Number(query?.limit) : defaultQueryVariables.limit,
  };
  const props = await getProps({ cms, npmsApi, api, vars, });
  return { props, };
});


export default RolesPage;
