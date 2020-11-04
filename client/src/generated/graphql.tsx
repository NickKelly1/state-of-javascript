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
  /** Json object with unknown keys & values */
  JsonObject: any;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  newsArticles: NewsArticleCollectionNode;
  roles: RoleCollectionNode;
  rolePermissions: RolePermissionCollectionNode;
  users: UserCollectionNode;
  userRoles: UserRoleCollectionNode;
  npmsPackages: NpmsPackageCollectionNode;
  npmsDashboards: NpmsDashboardCollectionNode;
  npmsDashboardItems: NpmsDashboardItemCollectionNode;
};


export type RootQueryTypeNewsArticlesArgs = {
  query?: Maybe<NewsArticleQuery>;
};


export type RootQueryTypeRolesArgs = {
  query?: Maybe<RoleQuery>;
};


export type RootQueryTypeRolePermissionsArgs = {
  query?: Maybe<RolePermissionQuery>;
};


export type RootQueryTypeUsersArgs = {
  query?: Maybe<UserQuery>;
};


export type RootQueryTypeUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type RootQueryTypeNpmsPackagesArgs = {
  query?: Maybe<NpmsPackageQuery>;
};


export type RootQueryTypeNpmsDashboardsArgs = {
  query?: Maybe<NpmsDashboardQuery>;
};


export type RootQueryTypeNpmsDashboardItemsArgs = {
  query?: Maybe<NpmsDashboardItemQuery>;
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
  submit: Scalars['Boolean'];
  reject: Scalars['Boolean'];
  approve: Scalars['Boolean'];
  publish: Scalars['Boolean'];
  unpublish: Scalars['Boolean'];
  schedule: Scalars['Boolean'];
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
  roles: RoleCollectionNode;
  permissions: PermissionCollectionNode;
  newsArticles: NewsArticleCollectionNode;
};


export type UserRelationsUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type UserRelationsRolesArgs = {
  query?: Maybe<RoleQuery>;
};


export type UserRelationsPermissionsArgs = {
  query?: Maybe<PermissionQuery>;
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
  permissions: PermissionCollectionNode;
  users: UserCollectionNode;
};


export type RoleRelationsUserRolesArgs = {
  query?: Maybe<UserRoleQuery>;
};


export type RoleRelationsRolePermissionsArgs = {
  query?: Maybe<RolePermissionQuery>;
};


export type RoleRelationsPermissionsArgs = {
  query?: Maybe<PermissionQuery>;
};


export type RoleRelationsUsersArgs = {
  query?: Maybe<UserQuery>;
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

export type PermissionCollectionNode = {
  __typename?: 'PermissionCollectionNode';
  nodes: Array<Maybe<PermissionNode>>;
  actions: PermissionCollectionActions;
  pagination: Meta;
};

export type PermissionNode = {
  __typename?: 'PermissionNode';
  cursor: Scalars['String'];
  data: PermissionData;
  actions: PermissionActions;
  relations: PermissionRelations;
};

export type PermissionActions = {
  __typename?: 'PermissionActions';
  show: Action;
  update: Action;
  delete: Action;
};

export type PermissionRelations = {
  __typename?: 'PermissionRelations';
  rolePermissions: RolePermissionCollectionNode;
  roles: RoleCollectionNode;
  users: UserCollectionNode;
};


export type PermissionRelationsRolePermissionsArgs = {
  query?: Maybe<PermissionQuery>;
};


export type PermissionRelationsRolesArgs = {
  query?: Maybe<RoleQuery>;
};


export type PermissionRelationsUsersArgs = {
  query?: Maybe<UserQuery>;
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

export type PermissionCollectionActions = {
  __typename?: 'PermissionCollectionActions';
  show: Action;
  create: Action;
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

export type NewsArticleCollectionActions = {
  __typename?: 'NewsArticleCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
};

export type NpmsPackageCollectionNode = {
  __typename?: 'NpmsPackageCollectionNode';
  nodes: Array<Maybe<NpmsPackageNode>>;
  can: NpmsPackageCollectionActions;
  pagination: Meta;
};

export type NpmsPackageNode = {
  __typename?: 'NpmsPackageNode';
  cursor: Scalars['String'];
  data: NpmsPackageData;
  can: NpmsPackageActions;
  relations: NpmsPackageRelations;
};

export type NpmsPackageData = {
  __typename?: 'NpmsPackageData';
  id: Scalars['Int'];
  name: Scalars['String'];
  data?: Maybe<NpmsPackageDataInfo>;
  last_ran_at: Scalars['DateTime'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type NpmsPackageDataInfo = {
  __typename?: 'NpmsPackageDataInfo';
  analyzedAt?: Maybe<Scalars['DateTime']>;
  collected?: Maybe<NpmsPackageDataInfoCollected>;
  evaluation?: Maybe<NpmsPackageDataInfoEvaluation>;
  score?: Maybe<NpmsPackageDataInfoScore>;
  error?: Maybe<Scalars['JsonObject']>;
};

export type NpmsPackageDataInfoCollected = {
  __typename?: 'NpmsPackageDataInfoCollected';
  metadata?: Maybe<NpmsPackageDataInfoCollectedMetadata>;
  npm?: Maybe<NpmsPackageDataInfoCollectedNpm>;
  github?: Maybe<NpmsPackageDataInfoCollectedGithub>;
  source?: Maybe<NpmsPackageDataInfoCollectedSource>;
};

export type NpmsPackageDataInfoCollectedMetadata = {
  __typename?: 'NpmsPackageDataInfoCollectedMetadata';
  releases?: Maybe<Array<NpmsPackageDataInfoCollectedMetadataReleases>>;
  hasTestScript?: Maybe<Scalars['Boolean']>;
  hasSelectiveFiles?: Maybe<Scalars['Boolean']>;
  readme?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  keywords?: Maybe<Array<Scalars['String']>>;
  date?: Maybe<Scalars['DateTime']>;
  author?: Maybe<NpmsPackageInfoCollectedMetadataUser>;
  publisher?: Maybe<NpmsPackageInfoCollectedMetadataUser>;
  maintainers?: Maybe<Array<NpmsPackageInfoCollectedMetadataUser>>;
  repository?: Maybe<NpmsPackageDataInfoCollectedMetadataRepository>;
};

export type NpmsPackageDataInfoCollectedMetadataReleases = {
  __typename?: 'NpmsPackageDataInfoCollectedMetadataReleases';
  from?: Maybe<Scalars['DateTime']>;
  to?: Maybe<Scalars['DateTime']>;
  count?: Maybe<Scalars['Int']>;
};

export type NpmsPackageInfoCollectedMetadataUser = {
  __typename?: 'NpmsPackageInfoCollectedMetadataUser';
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type NpmsPackageDataInfoCollectedMetadataRepository = {
  __typename?: 'NpmsPackageDataInfoCollectedMetadataRepository';
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type NpmsPackageDataInfoCollectedNpm = {
  __typename?: 'NpmsPackageDataInfoCollectedNpm';
  downloads?: Maybe<NpmsPackageDataInfoCollectedNpmDownloads>;
  dependentsCount?: Maybe<Scalars['Int']>;
  dependencies?: Maybe<Scalars['JsonObject']>;
  devDependencies?: Maybe<Scalars['JsonObject']>;
  starsCount?: Maybe<Scalars['Int']>;
};

export type NpmsPackageDataInfoCollectedNpmDownloads = {
  __typename?: 'NpmsPackageDataInfoCollectedNpmDownloads';
  from?: Maybe<Scalars['DateTime']>;
  to?: Maybe<Scalars['DateTime']>;
  count?: Maybe<Scalars['Int']>;
};


export type NpmsPackageDataInfoCollectedGithub = {
  __typename?: 'NpmsPackageDataInfoCollectedGithub';
  homepage?: Maybe<Scalars['String']>;
  starsCount?: Maybe<Scalars['Int']>;
  forksCount?: Maybe<Scalars['Int']>;
  subscribersCount?: Maybe<Scalars['Int']>;
  issues?: Maybe<NpmsPackageDataInfoCollectedGithubIssues>;
  contributors?: Maybe<Array<NpmsPackageDataInfoCollectedGitHubContributor>>;
  commits?: Maybe<Array<NpmsPackageDataInfCollectedGitHubCommit>>;
  statuses?: Maybe<Array<NpmsPackageDataInfoCollectedGitHubStatus>>;
};

export type NpmsPackageDataInfoCollectedGithubIssues = {
  __typename?: 'NpmsPackageDataInfoCollectedGithubIssues';
  count?: Maybe<Scalars['Int']>;
  openCount?: Maybe<Scalars['Int']>;
  distribution?: Maybe<NpmsPackageDataInfoCollectedGithubIssuesDistribution>;
  isDisabled?: Maybe<Scalars['Boolean']>;
};

export type NpmsPackageDataInfoCollectedGithubIssuesDistribution = {
  __typename?: 'NpmsPackageDataInfoCollectedGithubIssuesDistribution';
  _3600?: Maybe<Scalars['Int']>;
  _10800?: Maybe<Scalars['Int']>;
  _32400?: Maybe<Scalars['Int']>;
  _97200?: Maybe<Scalars['Int']>;
  _291600?: Maybe<Scalars['Int']>;
  _874800?: Maybe<Scalars['Int']>;
  _2624400?: Maybe<Scalars['Int']>;
  _7873200?: Maybe<Scalars['Int']>;
  _23619600?: Maybe<Scalars['Int']>;
  _70858800?: Maybe<Scalars['Int']>;
  _212576400?: Maybe<Scalars['Int']>;
};

export type NpmsPackageDataInfoCollectedGitHubContributor = {
  __typename?: 'NpmsPackageDataInfoCollectedGitHubContributor';
  username?: Maybe<Scalars['String']>;
  commitsCount?: Maybe<Scalars['String']>;
};

export type NpmsPackageDataInfCollectedGitHubCommit = {
  __typename?: 'NpmsPackageDataInfCollectedGitHubCommit';
  from?: Maybe<Scalars['DateTime']>;
  to?: Maybe<Scalars['DateTime']>;
  count?: Maybe<Scalars['Int']>;
};

export type NpmsPackageDataInfoCollectedGitHubStatus = {
  __typename?: 'NpmsPackageDataInfoCollectedGitHubStatus';
  context?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type NpmsPackageDataInfoCollectedSource = {
  __typename?: 'NpmsPackageDataInfoCollectedSource';
  files?: Maybe<NpmsPackageDataInfoCollectedNpmSourceFiles>;
  linters?: Maybe<Array<Scalars['String']>>;
  coverage?: Maybe<Scalars['Float']>;
};

export type NpmsPackageDataInfoCollectedNpmSourceFiles = {
  __typename?: 'NpmsPackageDataInfoCollectedNpmSourceFiles';
  readmeSize?: Maybe<Scalars['Int']>;
  testsSize?: Maybe<Scalars['Int']>;
  hasChangeLog?: Maybe<Scalars['Boolean']>;
};

export type NpmsPackageDataInfoEvaluation = {
  __typename?: 'NpmsPackageDataInfoEvaluation';
  quality?: Maybe<NpmsPackageDataInfoEvaluationQuality>;
  popularity?: Maybe<NpmsPackageDataInfoEvaluationPopularity>;
  maintenance?: Maybe<NpmsPackageDataInfoEvaluationMaintenance>;
};

export type NpmsPackageDataInfoEvaluationQuality = {
  __typename?: 'NpmsPackageDataInfoEvaluationQuality';
  carefulness?: Maybe<Scalars['Float']>;
  tests?: Maybe<Scalars['Float']>;
  health?: Maybe<Scalars['Float']>;
  branding?: Maybe<Scalars['Float']>;
};

export type NpmsPackageDataInfoEvaluationPopularity = {
  __typename?: 'NpmsPackageDataInfoEvaluationPopularity';
  communityInterest?: Maybe<Scalars['Float']>;
  downloadsCount?: Maybe<Scalars['Float']>;
  downloadsAcceleration?: Maybe<Scalars['Float']>;
  dependentsCount?: Maybe<Scalars['Float']>;
};

export type NpmsPackageDataInfoEvaluationMaintenance = {
  __typename?: 'NpmsPackageDataInfoEvaluationMaintenance';
  releaseFrequency?: Maybe<Scalars['Float']>;
  commitsFrequency?: Maybe<Scalars['Float']>;
  openIssues?: Maybe<Scalars['Float']>;
  issuesDistribution?: Maybe<Scalars['Float']>;
};

export type NpmsPackageDataInfoScore = {
  __typename?: 'NpmsPackageDataInfoScore';
  final?: Maybe<Scalars['Float']>;
  detail?: Maybe<NpmsPackageDataInfoScoreDetail>;
};

export type NpmsPackageDataInfoScoreDetail = {
  __typename?: 'NpmsPackageDataInfoScoreDetail';
  quality?: Maybe<Scalars['Float']>;
  popularity?: Maybe<Scalars['Float']>;
  maintenance?: Maybe<Scalars['Float']>;
};

export type NpmsPackageActions = {
  __typename?: 'NpmsPackageActions';
  show: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type NpmsPackageRelations = {
  __typename?: 'NpmsPackageRelations';
  dashboardItems: NpmsDashboardItemCollectionNode;
  dashboards: NpmsDashboardCollectionNode;
};


export type NpmsPackageRelationsDashboardItemsArgs = {
  query?: Maybe<NpmsDashboardItemQuery>;
};


export type NpmsPackageRelationsDashboardsArgs = {
  query?: Maybe<NpmsDashboardQuery>;
};

export type NpmsDashboardItemCollectionNode = {
  __typename?: 'NpmsDashboardItemCollectionNode';
  nodes: Array<Maybe<NpmsDashboardItemNode>>;
  can: NpmsDashboardItemCollectionActions;
  pagination: Meta;
};

export type NpmsDashboardItemNode = {
  __typename?: 'NpmsDashboardItemNode';
  cursor: Scalars['String'];
  data: NpmsDashboardItemData;
  can: NpmsDashboardItemActions;
  relations: NpmsDashboardItemRelations;
};

export type NpmsDashboardItemData = {
  __typename?: 'NpmsDashboardItemData';
  id: Scalars['Int'];
  dashboard_id: Scalars['Int'];
  npms_package_id: Scalars['Int'];
  order: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type NpmsDashboardItemActions = {
  __typename?: 'NpmsDashboardItemActions';
  show: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type NpmsDashboardItemRelations = {
  __typename?: 'NpmsDashboardItemRelations';
  dashboard?: Maybe<NpmsDashboardNode>;
  npmsPackage?: Maybe<NpmsPackageNode>;
};

export type NpmsDashboardNode = {
  __typename?: 'NpmsDashboardNode';
  cursor: Scalars['String'];
  data: NpmsDashboardData;
  can: NpmsDashboardActions;
  relations: NpmsDashboardRelations;
};

export type NpmsDashboardData = {
  __typename?: 'NpmsDashboardData';
  id: Scalars['Int'];
  name: Scalars['String'];
  order: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
};

export type NpmsDashboardActions = {
  __typename?: 'NpmsDashboardActions';
  show: Scalars['Boolean'];
  update: Scalars['Boolean'];
  delete: Scalars['Boolean'];
};

export type NpmsDashboardRelations = {
  __typename?: 'NpmsDashboardRelations';
  items: NpmsDashboardItemCollectionNode;
  npmsPackages: NpmsPackageCollectionNode;
};


export type NpmsDashboardRelationsItemsArgs = {
  query?: Maybe<NpmsDashboardItemQuery>;
};


export type NpmsDashboardRelationsNpmsPackagesArgs = {
  query?: Maybe<NpmsPackageQuery>;
};

export type NpmsDashboardItemQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<NpmsDashboardItemQueryFilterFilterConditionGroup>>;
};

export type NpmsDashboardItemQueryFilterFilterConditionGroup = {
  attr?: Maybe<NpmsDashboardItemQueryFilterFilterAttributes>;
  or?: Maybe<Array<NpmsDashboardItemQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<NpmsDashboardItemQueryFilterFilterConditionGroup>>;
};

export type NpmsDashboardItemQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  dashboard_id?: Maybe<FilterFieldNumber>;
  npms_id?: Maybe<FilterFieldNumber>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type NpmsPackageQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<NpmsPackageQueryFilterFilterConditionGroup>>;
};

export type NpmsPackageQueryFilterFilterConditionGroup = {
  attr?: Maybe<NpmsPackageQueryFilterFilterAttributes>;
  or?: Maybe<Array<NpmsPackageQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<NpmsPackageQueryFilterFilterConditionGroup>>;
};

export type NpmsPackageQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  name?: Maybe<FilterFieldString>;
  last_ran_at?: Maybe<FilterFieldDateTime>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type NpmsDashboardItemCollectionActions = {
  __typename?: 'NpmsDashboardItemCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
};

export type NpmsDashboardCollectionNode = {
  __typename?: 'NpmsDashboardCollectionNode';
  nodes: Array<Maybe<NpmsDashboardNode>>;
  can: NpmsDashboardCollectionActions;
  pagination: Meta;
};

export type NpmsDashboardCollectionActions = {
  __typename?: 'NpmsDashboardCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
};

export type NpmsDashboardQuery = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sorts?: Maybe<Array<QuerySort>>;
  filter?: Maybe<Array<NpmsDashboardQueryFilterFilterConditionGroup>>;
};

export type NpmsDashboardQueryFilterFilterConditionGroup = {
  attr?: Maybe<NpmsDashboardQueryFilterFilterAttributes>;
  or?: Maybe<Array<NpmsDashboardQueryFilterFilterConditionGroup>>;
  and?: Maybe<Array<NpmsDashboardQueryFilterFilterConditionGroup>>;
};

export type NpmsDashboardQueryFilterFilterAttributes = {
  id?: Maybe<FilterFieldNumber>;
  name?: Maybe<FilterFieldString>;
  created_at?: Maybe<FilterFieldDateTime>;
  updated_at?: Maybe<FilterFieldDateTime>;
  deleted_at?: Maybe<FilterFieldDateTime>;
};

export type NpmsPackageCollectionActions = {
  __typename?: 'NpmsPackageCollectionActions';
  show: Scalars['Boolean'];
  create: Scalars['Boolean'];
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  createNewsArticle: NewsArticleNode;
  updateNewsArticle: NewsArticleNode;
  deleteNewsArticle: NewsArticleNode;
  createNpmsPackage: NpmsPackageNode;
  createNpmsDashboard: NpmsDashboardNode;
  updateNpmsDashboard: NpmsDashboardNode;
  deleteNpmsDashboard: NpmsDashboardNode;
  createNpmsDashboardItem: NpmsDashboardItemNode;
  deleteNpmsDashboardItem: NpmsDashboardItemNode;
};


export type RootMutationTypeCreateNewsArticleArgs = {
  dto: CreateNewsArticle;
};


export type RootMutationTypeUpdateNewsArticleArgs = {
  dto: UpdateNewsArticle;
};


export type RootMutationTypeDeleteNewsArticleArgs = {
  dto: DeleteNewsArticle;
};


export type RootMutationTypeCreateNpmsPackageArgs = {
  dto: CreateNpmsPackage;
};


export type RootMutationTypeCreateNpmsDashboardArgs = {
  dto: CreateNpmsDashboard;
};


export type RootMutationTypeUpdateNpmsDashboardArgs = {
  dto: UpdateNpmsDashboard;
};


export type RootMutationTypeDeleteNpmsDashboardArgs = {
  dto: DeleteNpmsDashboard;
};


export type RootMutationTypeCreateNpmsDashboardItemArgs = {
  dto: CreateNpmsDashboardItem;
};


export type RootMutationTypeDeleteNpmsDashboardItemArgs = {
  dto: DeleteNpmsDashboardItem;
};

export type CreateNewsArticle = {
  title: Scalars['String'];
  teaser: Scalars['String'];
  body: Scalars['String'];
};

export type UpdateNewsArticle = {
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  teaser?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
};

export type DeleteNewsArticle = {
  id: Scalars['Int'];
};

export type CreateNpmsPackage = {
  name: Scalars['String'];
};

export type CreateNpmsDashboard = {
  name: Scalars['String'];
  npms_package_ids?: Maybe<Array<Scalars['Int']>>;
};

export type UpdateNpmsDashboard = {
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  npms_package_ids?: Maybe<Array<Scalars['Int']>>;
};

export type DeleteNpmsDashboard = {
  id: Scalars['Int'];
};

export type CreateNpmsDashboardItem = {
  dashboard_id: Scalars['Int'];
  npms_id: Scalars['Int'];
};

export type DeleteNpmsDashboardItem = {
  id: Scalars['Int'];
};

export type CreateNpmsDashboardFormMutationVariables = Exact<{
  name: Scalars['String'];
  npms_package_ids?: Maybe<Array<Scalars['Int']>>;
}>;


export type CreateNpmsDashboardFormMutation = (
  { __typename?: 'RootMutationType' }
  & { createNpmsDashboard: (
    { __typename?: 'NpmsDashboardNode' }
    & Pick<NpmsDashboardNode, 'cursor'>
    & { can: (
      { __typename?: 'NpmsDashboardActions' }
      & Pick<NpmsDashboardActions, 'show' | 'update' | 'delete'>
    ), data: (
      { __typename?: 'NpmsDashboardData' }
      & Pick<NpmsDashboardData, 'id' | 'name'>
    ) }
  ) }
);

export type UpdateNpmsDashboardFormMutationVariables = Exact<{
  id: Scalars['Int'];
  name: Scalars['String'];
  npms_package_ids?: Maybe<Array<Scalars['Int']>>;
}>;


export type UpdateNpmsDashboardFormMutation = (
  { __typename?: 'RootMutationType' }
  & { updateNpmsDashboard: (
    { __typename?: 'NpmsDashboardNode' }
    & Pick<NpmsDashboardNode, 'cursor'>
    & { can: (
      { __typename?: 'NpmsDashboardActions' }
      & Pick<NpmsDashboardActions, 'show' | 'update' | 'delete'>
    ), data: (
      { __typename?: 'NpmsDashboardData' }
      & Pick<NpmsDashboardData, 'id' | 'name'>
    ) }
  ) }
);

export type CreateNpmsPackageFormMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateNpmsPackageFormMutation = (
  { __typename?: 'RootMutationType' }
  & { createNpmsPackage: (
    { __typename?: 'NpmsPackageNode' }
    & Pick<NpmsPackageNode, 'cursor'>
    & { can: (
      { __typename?: 'NpmsPackageActions' }
      & Pick<NpmsPackageActions, 'show' | 'delete'>
    ), data: (
      { __typename?: 'NpmsPackageData' }
      & Pick<NpmsPackageData, 'id' | 'name'>
    ) }
  ) }
);

export type SearchNpmsPackageQueryVariables = Exact<{
  likeName?: Maybe<Scalars['String']>;
}>;


export type SearchNpmsPackageQuery = (
  { __typename?: 'RootQueryType' }
  & { npmsPackages: (
    { __typename?: 'NpmsPackageCollectionNode' }
    & { pagination: (
      { __typename?: 'meta' }
      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
    ), nodes: Array<Maybe<(
      { __typename?: 'NpmsPackageNode' }
      & { data: (
        { __typename?: 'NpmsPackageData' }
        & Pick<NpmsPackageData, 'id' | 'name'>
      ) }
    )>> }
  ) }
);

export type JsPageDeleteDashboardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type JsPageDeleteDashboardMutation = (
  { __typename?: 'RootMutationType' }
  & { deleteNpmsDashboard: (
    { __typename?: 'NpmsDashboardNode' }
    & Pick<NpmsDashboardNode, 'cursor'>
    & { can: (
      { __typename?: 'NpmsDashboardActions' }
      & Pick<NpmsDashboardActions, 'show' | 'update' | 'delete'>
    ), data: (
      { __typename?: 'NpmsDashboardData' }
      & Pick<NpmsDashboardData, 'id' | 'name'>
    ) }
  ) }
);

export type JsPageDashboardQueryVariables = Exact<{
  dashboardOffset?: Maybe<Scalars['Int']>;
  dashboardLimit?: Maybe<Scalars['Int']>;
  packageOffset?: Maybe<Scalars['Int']>;
  packageLimit?: Maybe<Scalars['Int']>;
}>;


export type JsPageDashboardQuery = (
  { __typename?: 'RootQueryType' }
  & { npmsDashboards: (
    { __typename?: 'NpmsDashboardCollectionNode' }
    & { can: (
      { __typename?: 'NpmsDashboardCollectionActions' }
      & Pick<NpmsDashboardCollectionActions, 'show' | 'create'>
    ), pagination: (
      { __typename?: 'meta' }
      & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
    ), nodes: Array<Maybe<(
      { __typename?: 'NpmsDashboardNode' }
      & Pick<NpmsDashboardNode, 'cursor'>
      & { can: (
        { __typename?: 'NpmsDashboardActions' }
        & Pick<NpmsDashboardActions, 'show' | 'update' | 'delete'>
      ), data: (
        { __typename?: 'NpmsDashboardData' }
        & Pick<NpmsDashboardData, 'id' | 'name'>
      ), relations: (
        { __typename?: 'NpmsDashboardRelations' }
        & { npmsPackages: (
          { __typename?: 'NpmsPackageCollectionNode' }
          & { can: (
            { __typename?: 'NpmsPackageCollectionActions' }
            & Pick<NpmsPackageCollectionActions, 'show' | 'create'>
          ), pagination: (
            { __typename?: 'meta' }
            & Pick<Meta, 'limit' | 'offset' | 'total' | 'page_number' | 'pages' | 'more'>
          ), nodes: Array<Maybe<(
            { __typename?: 'NpmsPackageNode' }
            & Pick<NpmsPackageNode, 'cursor'>
            & { can: (
              { __typename?: 'NpmsPackageActions' }
              & Pick<NpmsPackageActions, 'show' | 'delete'>
            ), data: (
              { __typename?: 'NpmsPackageData' }
              & Pick<NpmsPackageData, 'id' | 'name' | 'last_ran_at' | 'created_at' | 'updated_at'>
              & { data?: Maybe<(
                { __typename?: 'NpmsPackageDataInfo' }
                & { score?: Maybe<(
                  { __typename?: 'NpmsPackageDataInfoScore' }
                  & Pick<NpmsPackageDataInfoScore, 'final'>
                  & { detail?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoScoreDetail' }
                    & Pick<NpmsPackageDataInfoScoreDetail, 'quality' | 'popularity' | 'maintenance'>
                  )> }
                )>, evaluation?: Maybe<(
                  { __typename?: 'NpmsPackageDataInfoEvaluation' }
                  & { quality?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoEvaluationQuality' }
                    & Pick<NpmsPackageDataInfoEvaluationQuality, 'carefulness' | 'tests' | 'health' | 'branding'>
                  )>, popularity?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoEvaluationPopularity' }
                    & Pick<NpmsPackageDataInfoEvaluationPopularity, 'communityInterest' | 'downloadsCount' | 'downloadsAcceleration' | 'dependentsCount'>
                  )>, maintenance?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoEvaluationMaintenance' }
                    & Pick<NpmsPackageDataInfoEvaluationMaintenance, 'releaseFrequency' | 'commitsFrequency' | 'openIssues' | 'issuesDistribution'>
                  )> }
                )>, collected?: Maybe<(
                  { __typename?: 'NpmsPackageDataInfoCollected' }
                  & { metadata?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoCollectedMetadata' }
                    & Pick<NpmsPackageDataInfoCollectedMetadata, 'hasTestScript' | 'hasSelectiveFiles' | 'name'>
                  )>, github?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoCollectedGithub' }
                    & Pick<NpmsPackageDataInfoCollectedGithub, 'starsCount' | 'forksCount' | 'subscribersCount'>
                    & { commits?: Maybe<Array<(
                      { __typename?: 'NpmsPackageDataInfCollectedGitHubCommit' }
                      & Pick<NpmsPackageDataInfCollectedGitHubCommit, 'from' | 'to' | 'count'>
                    )>>, issues?: Maybe<(
                      { __typename?: 'NpmsPackageDataInfoCollectedGithubIssues' }
                      & Pick<NpmsPackageDataInfoCollectedGithubIssues, 'count' | 'openCount' | 'isDisabled'>
                    )> }
                  )>, npm?: Maybe<(
                    { __typename?: 'NpmsPackageDataInfoCollectedNpm' }
                    & Pick<NpmsPackageDataInfoCollectedNpm, 'starsCount' | 'dependentsCount' | 'dependencies' | 'devDependencies'>
                    & { downloads?: Maybe<(
                      { __typename?: 'NpmsPackageDataInfoCollectedNpmDownloads' }
                      & Pick<NpmsPackageDataInfoCollectedNpmDownloads, 'from' | 'to' | 'count'>
                    )> }
                  )> }
                )> }
              )> }
            ) }
          )>> }
        ) }
      ) }
    )>> }
  ) }
);

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

export type EditNewsArticlePageQueryVariables = Exact<{
  news_article_id: Scalars['Float'];
}>;


export type EditNewsArticlePageQuery = (
  { __typename?: 'RootQueryType' }
  & { newsArticles: (
    { __typename?: 'NewsArticleCollectionNode' }
    & { nodes: Array<Maybe<(
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
          & { data: (
            { __typename?: 'UserData' }
            & Pick<UserData, 'id' | 'name' | 'created_at' | 'updated_at' | 'deleted_at'>
          ) }
        )> }
      ) }
    )>> }
  ) }
);

export type UpdateNewsArticleMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  teaser?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
}>;


export type UpdateNewsArticleMutation = (
  { __typename?: 'RootMutationType' }
  & { updateNewsArticle: (
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

export type ViewNewsArticlePageQueryVariables = Exact<{
  news_article_id: Scalars['Float'];
}>;


export type ViewNewsArticlePageQuery = (
  { __typename?: 'RootQueryType' }
  & { newsArticles: (
    { __typename?: 'NewsArticleCollectionNode' }
    & { nodes: Array<Maybe<(
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
          & { data: (
            { __typename?: 'UserData' }
            & Pick<UserData, 'id' | 'name' | 'created_at' | 'updated_at' | 'deleted_at'>
          ) }
        )> }
      ) }
    )>> }
  ) }
);
