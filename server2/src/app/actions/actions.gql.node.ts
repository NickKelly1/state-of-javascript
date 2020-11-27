import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { GqlNever, IGqlNever } from "../../common/gql/gql.ever";
import { IIntegrationCollectionGqlActionSource, IntegrationCollectionGqlActions } from "../integration/gql/integration.collection.gql.actions";
import { JobCollectionGqlActions, IJobCollectionGqlActionSource } from "../job/job.collection.gql.actions";
import { ILogCollectionGqlActionSource, LogCollectionGqlActions } from "../log/log.collection.gql.actions";
import { NewsArticleStatusCollectionGqlActions, INewsArticleStatusCollectionGqlActionSource } from "../news-article-status/gql/news-article-status.collection.gql.actions";
import { NewsArticleCollectionGqlActions, INewsArticleCollectionGqlActionSource } from "../news-article/gql/news-article.collection.gql.actions";
import { NpmsDashboardItemCollectionGqlActions, INpmsDashboardItemCollectionGqlActionSource } from "../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.actions";
import { NpmsDashboardCollectionGqlActions, INpmsDashboardCollectionGqlActionSource } from "../npms-dashboard/gql/npms-dashboard.collection.gql.actions";
import { NpmsPackageCollectionGqlActions, INpmsPackageCollectionGqlActionSource } from "../npms-package/gql/npms-package.collection.gql.actions";
import { PermissionCollectionGqlActions, IPermissionCollectionGqlActionSource } from "../permission/gql/permission.collection.gql.actions";
import { RolePermissionCollectionGqlActions, IRolePermissionCollectionGqlActionSource } from "../role-permission/gql/role-permission.collection.gql.actions";
import { RoleCollectionGqlActions, IRoleCollectionGqlActionSource } from "../role/gql/role.collection.gql.actions";
import { UserRoleCollectionGqlActions, IUserRoleCollectionGqlActionSource } from "../user-role/gql/user-role.collection.gql.actions";
import { UserCollectionGqlActions, IUserCollectionGqlActionSource } from "../user/gql/user.collection.gql.actions";

export type IActionsGqlNodeSource = IGqlNever;
export const ActionsGqlNode = new GraphQLObjectType<IActionsGqlNodeSource, GqlContext>({
  name: 'ActionsNode',
  fields: () => ({
    users: {
      type: GraphQLNonNull(UserCollectionGqlActions),
      resolve: (): IUserCollectionGqlActionSource => GqlNever,
    },
    roles: {
      type: GraphQLNonNull(RoleCollectionGqlActions),
      resolve: (): IRoleCollectionGqlActionSource => GqlNever,
    },
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlActions),
      resolve: (): IUserRoleCollectionGqlActionSource => GqlNever,
    },
    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlActions),
      resolve: (): IPermissionCollectionGqlActionSource => GqlNever,
    },
    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlActions),
      resolve: (): IRolePermissionCollectionGqlActionSource => GqlNever,
    },
    npmsPackages: {
      type: GraphQLNonNull(NpmsPackageCollectionGqlActions),
      resolve: (): INpmsPackageCollectionGqlActionSource => GqlNever,
    },
    npmsDashboards: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlActions),
      resolve: (): INpmsDashboardCollectionGqlActionSource => GqlNever,
    },
    npmsDashboardItems: {
      type: GraphQLNonNull(NpmsDashboardItemCollectionGqlActions),
      resolve: (): INpmsDashboardItemCollectionGqlActionSource => GqlNever,
    },
    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlActions),
      resolve: (): INewsArticleCollectionGqlActionSource => GqlNever,
    },
    newsArticleStatuses: {
      type: GraphQLNonNull(NewsArticleStatusCollectionGqlActions),
      resolve: (): INewsArticleStatusCollectionGqlActionSource => GqlNever,
    },
    jobs: {
      type: GraphQLNonNull(JobCollectionGqlActions),
      resolve: (): IJobCollectionGqlActionSource => GqlNever,
    },
    logs: {
      type: GraphQLNonNull(LogCollectionGqlActions),
      resolve: (): ILogCollectionGqlActionSource => GqlNever,
    },
    integrations: {
      type: GraphQLNonNull(IntegrationCollectionGqlActions),
      resolve: (): IIntegrationCollectionGqlActionSource => GqlNever,
    },
    // TODO: blogs
  }),
});
