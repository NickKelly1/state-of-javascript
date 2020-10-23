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
  newsArticles: NewsArticleConnection;
  users: UserConnection;
  userRoles: UserRoleConnection;
  roles: RoleGqlConnection;
  rolePermissions: RolePermissionConnection;
};


export type RootQueryTypeNewsArticlesArgs = {
  query?: Maybe<NewsArticleQuery>;
};


export type RootQueryTypeUsersArgs = {
  query?: Maybe<UserQuery>;
};


export type RootQueryTypeUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type RootQueryTypeRolesArgs = {
  query?: Maybe<RoleQuery>;
};


export type RootQueryTypeRolePermissionsArgs = {
  query?: Maybe<RolePermissionQuery>;
};

export type NewsArticleConnection = {
  __typename?: 'NewsArticleConnection';
  edges: Array<Maybe<NewsArticleEdge>>;
  meta: Meta;
};

export type NewsArticleEdge = {
  __typename?: 'NewsArticleEdge';
  node: NewsArticle;
  cursor: Scalars['String'];
};

export type NewsArticle = {
  __typename?: 'NewsArticle';
  id: Scalars['Int'];
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
  author_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  author: UserEdge;
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
  newsArticleConnection: NewsArticleConnection;
};


export type UserUserRoleConnectionArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type UserNewsArticleConnectionArgs = {
  query?: Maybe<NewsArticleQuery>;
};

export type UserRoleConnection = {
  __typename?: 'UserRoleConnection';
  edges: Array<Maybe<UserRoleEdge>>;
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
  user?: Maybe<UserEdge>;
  role?: Maybe<RoleEdge>;
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
  query?: Maybe<UserRoleQuery>;
};


export type RoleRolePermissionConnectionArgs = {
  query?: Maybe<RolePermissionQuery>;
};

export type UserRoleQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<UserRoleQueryFilterFilterConditionGroup>>;
};

export type QuerySort = {
  field: Scalars['String'];
  dir: SortDirection;
};

export enum SortDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type UserRoleQueryFilterFilterConditionGroup = {
  attr?: Maybe<UserRoleQueryFilterFilterAttributes>;
  or?: Maybe<Array<UserRoleQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<UserRoleQueryFilterFilterConditionGroup>>;
};

export type UserRoleQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  user_id?: Maybe<FilterFieldNumber>;
  role_id?: Maybe<FilterFieldNumber>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
};

export type FilterFieldNumber = {
  eq?: Maybe<Scalars['Float']>;
  neq?: Maybe<Scalars['Float']>;
  null?: Maybe<Scalars['Boolean']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  nbetween?: Maybe<FilterRangeFloat>;
  between?: Maybe<FilterRangeFloat>;
  in?: Maybe<Scalars['Float']>;
  nin?: Maybe<Scalars['Float']>;
  strict_left?: Maybe<FilterRangeFloat>;
  strict_right?: Maybe<FilterRangeFloat>;
};

export type FilterRangeFloat = {
  from: Scalars['Float'];
  to: Scalars['Float'];
};

export type FilterFieldDateTime = {
  eq?: Maybe<Scalars['DateTime']>;
  neq?: Maybe<Scalars['DateTime']>;
  null?: Maybe<Scalars['Boolean']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  nbetween?: Maybe<FilterRangeDateTime>;
  between?: Maybe<FilterRangeDateTime>;
  in?: Maybe<Scalars['DateTime']>;
  nin?: Maybe<Scalars['DateTime']>;
  strict_left?: Maybe<FilterRangeDateTime>;
  strict_right?: Maybe<FilterRangeDateTime>;
};

export type FilterRangeDateTime = {
  from: Scalars['DateTime'];
  to: Scalars['DateTime'];
};

export type RolePermissionConnection = {
  __typename?: 'RolePermissionConnection';
  edges: Array<Maybe<RolePermissionEdge>>;
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
  query?: Maybe<PermissionQuery>;
};

export type PermissionQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<PermissionQueryFilterFilterConditionGroup>>;
};

export type PermissionQueryFilterFilterConditionGroup = {
  attr?: Maybe<PermissionQueryFilterFilterAttributes>;
  or?: Maybe<Array<PermissionQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<PermissionQueryFilterFilterConditionGroup>>;
};

export type PermissionQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  role_id?: Maybe<FilterFieldNumber>;
  permission_id?: Maybe<FilterFieldNumber>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
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

export type RolePermissionQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<RolePermissionQueryFilterFilterConditionGroup>>;
};

export type RolePermissionQueryFilterFilterConditionGroup = {
  attr?: Maybe<RolePermissionQueryFilterFilterAttributes>;
  or?: Maybe<Array<RolePermissionQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<RolePermissionQueryFilterFilterConditionGroup>>;
};

export type RolePermissionQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  role_id?: Maybe<FilterFieldNumber>;
  user_id?: Maybe<FilterFieldNumber>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type NewsArticleQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<NewsArticleQueryFilterFilterConditionGroup>>;
};

export type NewsArticleQueryFilterFilterConditionGroup = {
  attr?: Maybe<NewsArticleQueryFilterFilterAttributes>;
  or?: Maybe<Array<NewsArticleQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<NewsArticleQueryFilterFilterConditionGroup>>;
};

export type NewsArticleQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  title?: Maybe<FilterFieldString>;
  teaser?: Maybe<FilterFieldString>;
  body?: Maybe<FilterFieldString>;
  author_id?: Maybe<FilterFieldNumber>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type FilterFieldString = {
  eq?: Maybe<Scalars['String']>;
  neq?: Maybe<Scalars['String']>;
  null?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  nbetween?: Maybe<FilterRangeString>;
  between?: Maybe<FilterRangeString>;
  in?: Maybe<Scalars['String']>;
  nin?: Maybe<Scalars['String']>;
  ilike?: Maybe<Scalars['String']>;
  nilike?: Maybe<Scalars['String']>;
  like?: Maybe<Scalars['String']>;
  nlike?: Maybe<Scalars['String']>;
  substring?: Maybe<Scalars['String']>;
  iregexp?: Maybe<Scalars['String']>;
  niregexp?: Maybe<Scalars['String']>;
  regexp?: Maybe<Scalars['String']>;
  nregexp?: Maybe<Scalars['String']>;
};

export type FilterRangeString = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<Maybe<UserEdge>>;
  meta: Meta;
};

export type UserQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<UserQueryFilterFilterConditionGroup>>;
};

export type UserQueryFilterFilterConditionGroup = {
  attr?: Maybe<UserQueryFilterFilterAttributes>;
  or?: Maybe<Array<UserQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<UserQueryFilterFilterConditionGroup>>;
};

export type UserQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  name?: Maybe<FilterFieldString>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type RoleGqlConnection = {
  __typename?: 'RoleGqlConnection';
  edges: Array<Maybe<RoleEdge>>;
  meta: Meta;
};

export type RoleQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<RoleQueryFilterFilterConditionGroup>>;
};

export type RoleQueryFilterFilterConditionGroup = {
  attr?: Maybe<RoleQueryFilterFilterAttributes>;
  or?: Maybe<Array<RoleQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<RoleQueryFilterFilterConditionGroup>>;
};

export type RoleQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  name?: Maybe<FilterFieldString>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  createNewsArticle: NewsArticle;
  login: AuthorisationObject;
  signup: AuthorisationObject;
};


export type RootMutationTypeCreateNewsArticleArgs = {
  dto: CreateNewsArticle;
};


export type RootMutationTypeLoginArgs = {
  dto: LoginInput;
};


export type RootMutationTypeSignupArgs = {
  dto: SignupInput;
};

export type CreateNewsArticle = {
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
};

export type AuthorisationObject = {
  __typename?: 'AuthorisationObject';
  access_token: Scalars['String'];
  refresh_token: Scalars['String'];
  access_token_object: AccessTokenObject;
  refresh_token_object: RefreshTokenObject;
};

export type AccessTokenObject = {
  __typename?: 'AccessTokenObject';
  user_id: Scalars['Int'];
  permissions: Array<Scalars['Int']>;
  iat: Scalars['String'];
  exp: Scalars['String'];
};

export type RefreshTokenObject = {
  __typename?: 'RefreshTokenObject';
  user_id: Scalars['Int'];
  iat: Scalars['String'];
  exp: Scalars['String'];
};

export type LoginInput = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type SignupInput = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type AuthSignupMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthSignupMutation = (
  { __typename?: 'RootMutationType' }
  & { signup: (
    { __typename?: 'AuthorisationObject' }
    & Pick<AuthorisationObject, 'access_token' | 'refresh_token'>
    & { access_token_object: (
      { __typename?: 'AccessTokenObject' }
      & Pick<AccessTokenObject, 'user_id' | 'permissions' | 'iat' | 'exp'>
    ), refresh_token_object: (
      { __typename?: 'RefreshTokenObject' }
      & Pick<RefreshTokenObject, 'user_id' | 'iat' | 'exp'>
    ) }
  ) }
);

export type AuthLoginMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthLoginMutation = (
  { __typename?: 'RootMutationType' }
  & { login: (
    { __typename?: 'AuthorisationObject' }
    & Pick<AuthorisationObject, 'access_token' | 'refresh_token'>
    & { access_token_object: (
      { __typename?: 'AccessTokenObject' }
      & Pick<AccessTokenObject, 'user_id' | 'permissions' | 'iat' | 'exp'>
    ), refresh_token_object: (
      { __typename?: 'RefreshTokenObject' }
      & Pick<RefreshTokenObject, 'user_id' | 'iat' | 'exp'>
    ) }
  ) }
);

export type CreateNewsArticlePageQueryVariables = Exact<{ [key: string]: never; }>;


export type CreateNewsArticlePageQuery = (
  { __typename?: 'RootQueryType' }
  & { newsArticles: (
    { __typename?: 'NewsArticleConnection' }
    & { meta: (
      { __typename?: 'meta' }
      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
    ), edges: Array<Maybe<(
      { __typename?: 'NewsArticleEdge' }
      & { node: (
        { __typename?: 'NewsArticle' }
        & Pick<NewsArticle, 'id' | 'title' | 'teaser' | 'body' | 'created_at' | 'updated_at' | 'deleted_at'>
      ) }
    )>> }
  ) }
);
