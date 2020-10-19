import { TableRow } from "@material-ui/core";
import { IUserRo } from "../../backend-api/services/user/dtos/user.ro";

export interface IUsersTableCellProps {
  row: IUserRo;
}

export function UsersTableCell(props: IUsersTableCellProps) {
  const { row } = props;

  //
  return (
    <>
      <TableRow>
      </TableRow>
      <TableRow>

      </TableRow>
    </>
  );
}