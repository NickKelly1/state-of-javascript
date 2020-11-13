import { Box } from '@material-ui/core';
import React from 'react';
import { Id } from '../../types/id.type';
import { IIdentityFn } from '../../types/identity-fn.type';
import { UserDetail } from './user.detail';
import { UserUserRolesForm } from './user-user-roles.form';
import { TabGroup } from '../tab-group/tab-group';

interface IUserTabsProps {
  user_id: Id;
  onStale?: IIdentityFn;
}

export function UserTabs(props: IUserTabsProps) {
  const { user_id, onStale } = props;
  //

  return (
    <>
      <TabGroup
        tabs={[{
          key: 'detail',
          label: 'Detail',
          accessor: () => (
            <Box p={3}>
              <UserDetail onUpdated={onStale} user_id={user_id} />
            </Box>
          ),
        }, {
          key: 'roles',
          label: 'Roles',
          accessor: () => (
            <Box p={3}>
              <UserUserRolesForm onSuccess={onStale} user_id={user_id} />
            </Box>
          ),
        }]}
      />
    </>
  );
}