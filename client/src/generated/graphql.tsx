export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** ISO string */
  DateTime: any;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  users: UserConnection;
  userRoles: UserRoleConnection;
  roles: RoleGqlConnection;
  rolePermissions: RolePermissionConnection;
};


export type RootQueryTypeUsersArgs = {
  options?: Maybe<Collection>;
};


export type RootQueryTypeUserRolesArgs = {
  options?: Maybe<Collection>;
};


export type RootQueryTypeRolesArgs = {
  options?: Maybe<Collection>;
};


export type RootQueryTypeRolePermissionsArgs = {
  options?: Maybe<Collection>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  meta: Meta;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
  cursor: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  userRoleConnection: UserRoleConnection;
};


export type UserUserRoleConnectionArgs = {
  options?: Maybe<Collection>;
};


export type UserRoleConnection = {
  __typename?: 'UserRoleConnection';
  edges: Array<UserRoleEdge>;
  meta: Meta;
};

export type UserRoleEdge = {
  __typename?: 'UserRoleEdge';
  node: UserRole;
  cursor: Scalars['String'];
};

export type UserRole = {
  __typename?: 'UserRole';
  id: Scalars['Int'];
  user_id: Scalars['Int'];
  role_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  user: UserEdge;
  role: RoleEdge;
};

export type RoleEdge = {
  __typename?: 'RoleEdge';
  node: Role;
  cursor: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  userRoleConnection: UserRoleConnection;
  rolePermissionConnection: RolePermissionConnection;
};


export type RoleUserRoleConnectionArgs = {
  options?: Maybe<Collection>;
};


export type RoleRolePermissionConnectionArgs = {
  options?: Maybe<Collection>;
};

export type Collection = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<Sort>>;
};

export type Sort = {
  field: Scalars['String'];
  dir: Dir;
};

export enum Dir {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type RolePermissionConnection = {
  __typename?: 'RolePermissionConnection';
  edges: Array<RolePermissionEdge>;
  meta: Meta;
};

export type RolePermissionEdge = {
  __typename?: 'RolePermissionEdge';
  node: RolePermission;
  cursor: Scalars['String'];
};

export type RolePermission = {
  __typename?: 'RolePermission';
  id: Scalars['Int'];
  role_id: Scalars['Int'];
  permission_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  role: RoleEdge;
  permission: PermissionEdge;
};

export type PermissionEdge = {
  __typename?: 'PermissionEdge';
  node: Permission;
  cursor: Scalars['String'];
};

export type Permission = {
  __typename?: 'Permission';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  rolePermissionConnection: RolePermissionConnection;
};


export type PermissionRolePermissionConnectionArgs = {
  options?: Maybe<Collection>;
};

export type Meta = {
  __typename?: 'meta';
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  total: Scalars['Int'];
  page_number: Scalars['Int'];
  pages: Scalars['Int'];
  more: Scalars['Boolean'];
};

export type RoleGqlConnection = {
  __typename?: 'RoleGqlConnection';
  edges: Array<RoleEdge>;
  meta: Meta;
};

export type AdminUsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminUsersPageQuery = (
  { __typename?: 'RootQueryType' }
  & { users: (
    { __typename?: 'UserConnection' }
    & { meta: (
      { __typename?: 'meta' }
      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
    ), edges: Array<(
      { __typename?: 'UserEdge' }
      & { node: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'created_at' | 'updated_at' | 'deleted_at'>
        & { userRoleConnection: (
          { __typename?: 'UserRoleConnection' }
          & { meta: (
            { __typename?: 'meta' }
            & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
          ), edges: Array<(
            { __typename?: 'UserRoleEdge' }
            & { node: (
              { __typename?: 'UserRole' }
              & Pick<UserRole, 'id' | 'user_id' | 'role_id' | 'created_at' | 'updated_at'>
              & { user: (
                { __typename?: 'UserEdge' }
                & { node: (
                  { __typename?: 'User' }
                  & Pick<User, 'id' | 'name'>
                ) }
              ), role: (
                { __typename?: 'RoleEdge' }
                & { node: (
                  { __typename?: 'Role' }
                  & Pick<Role, 'id' | 'name'>
                  & { rolePermissionConnection: (
                    { __typename?: 'RolePermissionConnection' }
                    & { meta: (
                      { __typename?: 'meta' }
                      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
                    ), edges: Array<(
                      { __typename?: 'RolePermissionEdge' }
                      & { node: (
                        { __typename?: 'RolePermission' }
                        & Pick<RolePermission, 'id' | 'role_id' | 'permission_id'>
                      ) }
                    )> }
                  ) }
                ) }
              ) }
            ) }
          )> }
        ) }
      ) }
    )> }
  ) }
);
