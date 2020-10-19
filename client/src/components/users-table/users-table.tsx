// import React, { useMemo } from 'react';
// import dayjs from 'dayjs';
// import { Column, ColumnGroup, useTable } from 'react-table';
// import { IPermissionRo } from '../../../src/backend-api/services/permission/dtos/permission.ro';
// import { IRolePermissionRo } from '../../../src/backend-api/services/role-permission/dtos/role-permission.ro';
// import { IRoleRo } from '../../../src/backend-api/services/role/dtos/role.ro';
// import { IUserRoleRo } from '../../../src/backend-api/services/user-roles/dtos/user-role.ro';
// import { IUserRo } from '../../../src/backend-api/services/user/dtos/user.ro';
// import { UserId } from '../../../src/backend-api/services/user/user.id';
// import { IApiCollection } from '../../../src/backend-api/types/api-collection.interface';
// import { pretty } from '../../../src/helpers/pretty.helper';
// import { serverSidePropsHandler } from "../../../src/helpers/server-side-props-handler.helper";
// import { Box, Collapse, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
// import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUpSharp';
// import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDownSharp';

import { TableCellProps } from "@material-ui/core";
import { ReactElement, ReactFragment, ReactText } from "react";


// export interface IAppDataTable {
//   users: IApiCollection<IUserRo>;
// }

// export function AppDataTable(props: IAppDataTable) {
//   const { users } = props;
//   const rows = users.data;

//   return (
//     <>
//     <TableContainer component={Paper}>
//       <Table aria-label="users table">
//         <TableHead>
//           <TableRow>
//             <TableCell />
//             <TableCell>Id</TableCell>
//             <TableCell align="right">Name</TableCell>
//             <TableCell align="right">Updated</TableCell>
//             <TableCell align="right">Created</TableCell>
//             <TableCell align="right">Deleted</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <UsersTableRow key={row.name} row={row} />
//           ))}
//         </TableBody>
//       </Table>

//     </TableContainer>

//     </>

//   );
// }

interface IAppDataTableColumnHeaderProps<T> {
  //
}

interface IAppDataTableColumnAccessorProps<T> {
  row: T
}

interface IAppDataTableColumns<T> {
  header: null | ReactText | ReactFragment | ReactElement<IAppDataTableColumnHeaderProps<T>>;
  accessor: keyof T | ReactElement<IAppDataTableColumnAccessorProps<T>>;
  headerProps?: TableCellProps;
  cellProps?: TableCellProps;
}
