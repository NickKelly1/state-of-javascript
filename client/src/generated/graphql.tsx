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
  newsArticles: NewsArticleCollectionNode;
  users: UserCollectionNode;
  userRoles: UserRoleCollectionNode;
  roles: RoleCollectionNode;
  rolePermissions: RolePermissionCollectionNode;
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

export type NewsArticleCollectionNode = {
  __typename?: 'NewsArticleCollectionNode';
  nodes: Array<Maybe<NewsArticleNode>>;
  can: NewsArticleCollectionActions;
  pagination: Meta;
};

export type NewsArticleNode = {
  __typename?: 'NewsArticleNode';
  cursor: Scalars['String'];
  data: NewsArticleData;
  can: NewsArticleActions;
  relations: NewsArticleRelations;
};

export type NewsArticleData = {
  __typename?: 'NewsArticleData';
  id: Scalars['Int'];
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
  author_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};


export type NewsArticleActions = {
  __typename?: 'NewsArticleActions';
  show: Scalars['Boolean'];
  update: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type NewsArticleRelations = {
  __typename?: 'NewsArticleRelations';
  author?: Maybe<UserNode>;
};

export type UserNode = {
  __typename?: 'UserNode';
  cursor: Scalars['String'];
  data: UserData;
  can: UserActions;
  relations: UserRelations;
};

export type UserData = {
  __typename?: 'UserData';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type UserActions = {
  __typename?: 'UserActions';
  show: Scalars['Boolean'];
  update: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type UserRelations = {
  __typename?: 'UserRelations';
  userRoles: UserRoleCollectionNode;
  newsArticles: NewsArticleCollectionNode;
};


export type UserRelationsUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type UserRelationsNewsArticlesArgs = {
  query?: Maybe<NewsArticleQuery>;
};

export type UserRoleCollectionNode = {
  __typename?: 'UserRoleCollectionNode';
  nodes: Array<Maybe<UserRoleNode>>;
  can: UserRoleCollectionActions;
  pagination: Meta;
};

export type UserRoleNode = {
  __typename?: 'UserRoleNode';
  cursor: Scalars['String'];
  data: UserRoleData;
  can: UserRoleActions;
  relations: UserRoleRelations;
};

export type UserRoleData = {
  __typename?: 'UserRoleData';
  id: Scalars['Int'];
  user_id: Scalars['Int'];
  role_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type UserRoleActions = {
  __typename?: 'UserRoleActions';
  show: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type UserRoleRelations = {
  __typename?: 'UserRoleRelations';
  user?: Maybe<UserNode>;
  role?: Maybe<RoleNode>;
};

export type RoleNode = {
  __typename?: 'RoleNode';
  cursor: Scalars['String'];
  data: RoleData;
  can: RoleActions;
  relations: RoleRelations;
};

export type RoleData = {
  __typename?: 'RoleData';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type RoleActions = {
  __typename?: 'RoleActions';
  show: Scalars['Boolean'];
  update: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type RoleRelations = {
  __typename?: 'RoleRelations';
  userRoles: UserRoleCollectionNode;
  rolePermissions: RolePermissionCollectionNode;
};


export type RoleRelationsUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type RoleRelationsRolePermissionsArgs = {
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

export type RolePermissionCollectionNode = {
  __typename?: 'RolePermissionCollectionNode';
  nodes: Array<Maybe<RolePermissionNode>>;
  actions: RolePermissionCollectionActions;
  pagination: Meta;
};

export type RolePermissionNode = {
  __typename?: 'RolePermissionNode';
  cursor: Scalars['String'];
  data: RolePermissionData;
  can: RolePermissionActions;
  relations: RolePermissionRelations;
};

export type RolePermissionData = {
  __typename?: 'RolePermissionData';
  id: Scalars['Int'];
  role_id: Scalars['Int'];
  permission_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type RolePermissionActions = {
  __typename?: 'RolePermissionActions';
  show: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type RolePermissionRelations = {
  __typename?: 'RolePermissionRelations';
  role?: Maybe<RoleNode>;
  permission?: Maybe<PermissionData>;
};

export type PermissionData = {
  __typename?: 'PermissionData';
  id: Scalars['Int'];
  name: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type RolePermissionCollectionActions = {
  __typename?: 'RolePermissionCollectionActions';
  show: Action;
  create: Action;
};

export type Action = {
  __typename?: 'Action';
  can: Scalars['Boolean'];
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

export type UserRoleCollectionActions = {
  __typename?: 'UserRoleCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
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

export type NewsArticleCollectionActions = {
  __typename?: 'NewsArticleCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
};

export type UserCollectionNode = {
  __typename?: 'UserCollectionNode';
  nodes: Array<Maybe<UserNode>>;
  can: UserCollectionActions;
  pagination: Meta;
};

export type UserCollectionActions = {
  __typename?: 'UserCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
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

export type RoleCollectionNode = {
  __typename?: 'RoleCollectionNode';
  nodes: Array<Maybe<RoleNode>>;
  can: RoleCollectionActions;
  pagination: Meta;
};

export type RoleCollectionActions = {
  __typename?: 'RoleCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
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
  createNewsArticle: NewsArticleNode;
};


export type RootMutationTypeCreateNewsArticleArgs = {
  dto: CreateNewsArticle;
};

export type CreateNewsArticle = {
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
};

export type CreateNewsArticleMutationVariables = Exact<{
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
}>;


export type CreateNewsArticleMutation = (
  { __typename?: 'RootMutationType' }
  & { createNewsArticle: (
    { __typename?: 'NewsArticleNode' }
    & { data: (
      { __typename?: 'NewsArticleData' }
      & Pick<NewsArticleData, 'id' | 'title' | 'teaser' | 'body' | 'author_id' | 'created_at' | 'updated_at' | 'deleted_at'>
    ) }
  ) }
);

export type IndexNewsPageQueryVariables = Exact<{
  news_offset?: Maybe<Scalars['Int']>;
  news_limit?: Maybe<Scalars['Int']>;
}>;


export type IndexNewsPageQuery = (
  { __typename?: 'RootQueryType' }
  & { newsArticles: (
    { __typename?: 'NewsArticleCollectionNode' }
    & { pagination: (
      { __typename?: 'meta' }
      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
    ), can: (
      { __typename?: 'NewsArticleCollectionActions' }
      & Pick<NewsArticleCollectionActions, 'show' | 'create'>
    ), nodes: Array<Maybe<(
      { __typename?: 'NewsArticleNode' }
      & Pick<NewsArticleNode, 'cursor'>
      & { can: (
        { __typename?: 'NewsArticleActions' }
        & Pick<NewsArticleActions, 'show' | 'update' | 'delete'>
      ), data: (
        { __typename?: 'NewsArticleData' }
        & Pick<NewsArticleData, 'id' | 'title' | 'teaser' | 'body' | 'author_id' | 'created_at' | 'updated_at' | 'deleted_at'>
      ), relations: (
        { __typename?: 'NewsArticleRelations' }
        & { author?: Maybe<(
          { __typename?: 'UserNode' }
          & Pick<UserNode, 'cursor'>
          & { can: (
            { __typename?: 'UserActions' }
            & Pick<UserActions, 'show' | 'update'>
          ), data: (
            { __typename?: 'UserData' }
            & Pick<UserData, 'id' | 'name' | 'created_at' | 'updated_at' | 'deleted_at'>
          ) }
        )> }
      ) }
    )>> }
  ) }
);

export type ViewNewsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewNewsPageQuery = (
  { __typename?: 'RootQueryType' }
  & { newsArticles: (
    { __typename?: 'NewsArticleCollectionNode' }
    & { nodes: Array<Maybe<(
      { __typename?: 'NewsArticleNode' }
      & { data: (
        { __typename?: 'NewsArticleData' }
        & Pick<NewsArticleData, 'id' | 'title' | 'teaser' | 'body' | 'author_id' | 'created_at' | 'updated_at' | 'deleted_at'>
      ), relations: (
        { __typename?: 'NewsArticleRelations' }
        & { author?: Maybe<(
          { __typename?: 'UserNode' }
          & { data: (
            { __typename?: 'UserData' }
            & Pick<UserData, 'id' | 'name' | 'created_at' | 'updated_at' | 'deleted_at'>
          ) }
        )> }
      ) }
    )>> }
  ) }
);
