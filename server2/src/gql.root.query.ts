import {
  GraphQLObjectType,
} from 'graphql';
import { GqlContext } from './common/context/gql.context';
import { unthunk } from './common/helpers/unthunk.helper';
import { NewsArticlesGqlQuery } from './app/news-article/gql/news-articles.gql.query';
import { NewsArticleStatusGqlQuery } from './app/news-article-status/gql/news-article-status.gql.query';
import { PermissionGqlQuery } from './app/permission/gql/permission.gql.query';
import { RoleGqlQuery } from './app/role/gql/role.gql.query';
import { RolePermissionGqlQuery } from './app/role-permission/gql/role-permission.gql.query';
import { UserGqlQuery } from './app/user/gql/user.gql.query';
import { UserRoleGqlQuery } from './app/user-role/gql/user-role.gql.query';
import { NpmsPackageGqlQuery } from './app/npms-package/gql/npms-package.gql.query';
import { NpmsDashboardsGqlQuery } from './app/npms-dashboard/gql/npms-dashboard.gql.query';
import { NpmsDashboardItemsGqlQuery } from './app/npms-dashboard-item/gql/npms-dashboard-item.gql.query';
import { IntegrationGqlQuery } from './app/integration/gql/integration.gql.query';
import { GoogleGqlQuery } from './app/google/gql/google.gql.query';


export const GqlRootQuery = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    ...unthunk(NewsArticlesGqlQuery),
    ...unthunk(NewsArticleStatusGqlQuery),
    ...unthunk(PermissionGqlQuery),
    ...unthunk(RoleGqlQuery),
    ...unthunk(RolePermissionGqlQuery),
    ...unthunk(UserGqlQuery),
    ...unthunk(UserRoleGqlQuery),
    ...unthunk(NpmsPackageGqlQuery),
    ...unthunk(NpmsDashboardsGqlQuery),
    ...unthunk(NpmsDashboardItemsGqlQuery),
    ...unthunk(IntegrationGqlQuery),
    ...unthunk(GoogleGqlQuery),
  }),
});
