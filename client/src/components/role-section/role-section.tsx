import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { Id } from '../../types/id.type';
import { RoleDetail } from '../role-detail/role.detail';
import { RoleRolePermissionForm } from '../role-role-permissions-form/role.form';
import { TabGroup } from '../tab-group/tab-group';

interface IRoleSectionProps {
  role_id: Id;
}

export function RoleSection(props: IRoleSectionProps) {
  const { role_id } = props;
  //

  return (
    <>
      <TabGroup
        tabs={[{
          key: 'detail',
          label: 'Detail',
          accessor: () => (
            <Box p={3}>
              <RoleDetail role_id={role_id} />
            </Box>
          ),
        }, {
          key: 'permissions',
          label: 'Permissions',
          accessor: () => (
            <Box p={3}>
              <RoleRolePermissionForm role_id={role_id} />
            </Box>
          ),
        }]}
      />
    </>
  );
}