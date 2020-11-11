import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { Id } from '../../types/id.type';
import { IIdentityFn } from '../../types/identity-fn.type';
import { RoleDetail } from '../role-detail/role.detail';
import { RoleRolePermissionForm } from '../role-role-permissions-form/role-role-permissions.form';
import { TabGroup } from '../tab-group/tab-group';

interface IRoleSectionProps {
  role_id: Id;
  onStale?: IIdentityFn;
}

export function RoleSection(props: IRoleSectionProps) {
  const { role_id, onStale } = props;
  //

  return (
    <>
      <TabGroup
        tabs={[{
          key: 'detail',
          label: 'Detail',
          accessor: () => (
            <Box p={3}>
              <RoleDetail onUpdated={onStale} role_id={role_id} />
            </Box>
          ),
        }, {
          key: 'permissions',
          label: 'Permissions',
          accessor: () => (
            <Box p={3}>
              <RoleRolePermissionForm onSuccess={onStale} role_id={role_id} />
            </Box>
          ),
        }]}
      />
    </>
  );
}