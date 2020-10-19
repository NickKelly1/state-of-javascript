import { TableRow } from "@material-ui/core";
import { IUserRo } from "../../backend-api/services/user/dtos/user.ro";

export interface IUsersTableRowProps {
  row: IUserRo;
}

export function UsersTableRow(props: IUsersTableRowProps) {
  const { row } = props;

  //
  return (
    <>
      <TableRow>
        <UsersTableCell>

        </UsersTableCell>
      </TableRow>
      <TableRow>

      </TableRow>
    </>
  );
}