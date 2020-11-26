import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, GraphQLObjectType, Thunk } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { GqlNever, IGqlNever } from "../../common/gql/gql.ever";
import { IJobCollectionGqlActionSource, JobCollectionGqlActions } from "../job/job.collection.gql.actions";
import { INewsArticleStatusCollectionGqlActionSource, NewsArticleStatusCollectionGqlActions } from "../news-article-status/gql/news-article-status.collection.gql.actions";
import { INewsArticleStatusCollectionGqlNodeSource } from "../news-article-status/gql/news-article-status.collection.gql.node";
import { INewsArticleCollectionGqlActionSource, NewsArticleCollectionGqlActions } from "../news-article/gql/news-article.collection.gql.actions";
import { INpmsDashboardItemCollectionGqlActionSource, NpmsDashboardItemCollectionGqlActions } from "../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.actions";
import { NpmsDashboardItemGqlActions } from "../npms-dashboard-item/gql/npms-dashboard-item.gql.actions";
import { INpmsDashboardItemGqlNodeSource } from "../npms-dashboard-item/gql/npms-dashboard-item.gql.node";
import { INpmsDashboardCollectionGqlActionSource, NpmsDashboardCollectionGqlActions } from "../npms-dashboard/gql/npms-dashboard.collection.gql.actions";
import { INpmsDashboardGqlActionsSource } from "../npms-dashboard/gql/npms-dashboard.gql.actions";
import { INpmsPackageCollectionGqlActionSource, NpmsPackageCollectionGqlActions } from "../npms-package/gql/npms-package.collection.gql.actions";
import { IPermissionCollectionGqlActionSource, PermissionCollectionGqlActions } from "../permission/gql/permission.collection.gql.actions";
import { PermissionGqlActions } from "../permission/gql/permission.gql.actions";
import { IRolePermissionCollectionGqlActionSource, RolePermissionCollectionGqlActions } from "../role-permission/gql/role-permission.collection.gql.actions";
import { IRoleCollectionGqlActionSource, RoleCollectionGqlActions } from "../role/gql/role.collection.gql.actions";
import { IUserRoleCollectionGqlActionSource, UserRoleCollectionGqlActions } from "../user-role/gql/user-role.collection.gql.actions";
import { IUserCollectionGqlActionSource, UserCollectionGqlActions } from "../user/gql/user.collection.gql.actions";
import { ActionsGqlNode, IActionsGqlNodeSource } from "./actions.gql.node";



export const ActionsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  actions: { type: GraphQLNonNull(ActionsGqlNode), resolve: (): IActionsGqlNodeSource => GqlNever, },
});
