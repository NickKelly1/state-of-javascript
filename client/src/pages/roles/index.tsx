import { NextRouter, useRouter } from "next/router";
import React, { useMemo } from "react";
import { IRolesTableProps, RolesTable } from "../../components/roles/roles.table";
import { ist } from "../../helpers/ist.helper";

interface IRolesPageProps {
  //
}

function RolesPage(props: IRolesPageProps) {
  const router: NextRouter = useRouter();
  const rolesProps = useMemo((): IRolesTableProps => ({
    offset: ist.notNullable(router.query?.offset) ? Number(router.query?.offset) : undefined,
    limit: ist.notNullable(router.query?.limit) ? Number(router.query?.limit) : undefined,
  }), [router.query])
  return (
    <>
      <RolesTable {...rolesProps} />
    </>
  );
}

export default RolesPage;