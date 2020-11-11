import { GraphQLObjectType } from 'graphql';
import { NewsArticleGqlMutations } from './app/news-article/gql/news-article.gql.mutations';
import { NpmsDashboardItemGqlMutations } from './app/npms-dashboard-item/gql/npms-dashboard-item.gql.mutations';
import { NpmsDashboardGqlMutations } from './app/npms-dashboard/gql/npms-dashboard.gql.mutations';
import { NpmsPackageGqlMutations } from './app/npms-package/gql/npms-package.gql.mutations';
import { RolePermissionGqlMutations } from './app/role-permission/gql/role-permission.gql.mutations';
import { RoleGqlMutations } from './app/role/gql/role.gql.mutations';
import { GqlContext } from './common/context/gql.context';
import { unthunk } from './common/helpers/unthunk.helper';

export const GqlRootMutation = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootMutationType',
  fields: () => ({
    ...unthunk(NewsArticleGqlMutations),
    ...unthunk(NpmsPackageGqlMutations),
    ...unthunk(NpmsDashboardGqlMutations),
    ...unthunk(NpmsDashboardItemGqlMutations),
    ...unthunk(RolePermissionGqlMutations),
    ...unthunk(RoleGqlMutations),
  }),
});
