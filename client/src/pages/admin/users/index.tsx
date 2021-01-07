import { NextRouter, useRouter } from "next/router";
import React, { useMemo } from "react";
import { IUsersTableProps, UsersTable } from "../../../components/users/user.table";
import { ist } from "../../../helpers/ist.helper";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUsersPageProps {
  //
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UsersPage(props: IUsersPageProps): JSX.Element {
  const router: NextRouter = useRouter();
  const rolesProps = useMemo((): IUsersTableProps => ({
    offset: ist.notNullable(router.query?.offset) ? Number(router.query?.offset) : undefined,
    limit: ist.notNullable(router.query?.limit) ? Number(router.query?.limit) : undefined,
  }), [router.query])
  return <UsersTable {...rolesProps} />;
}

export default UsersPage;