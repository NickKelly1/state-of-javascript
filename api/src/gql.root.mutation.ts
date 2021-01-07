import { GraphQLObjectType } from 'graphql';
import { AuthGqlMutations } from './app/auth/auth.gql.mutations';
import { BlogPostCommentGqlMutations } from './app/blog-post-comment/gql/blog-post-comment.gql.mutations';
import { BlogPostGqlMutations } from './app/blog-post/gql/blog-post.gql.mutations';
import { GoogleGqlMutations } from './app/google/gql/google.gql.mutations';
import { IntegrationGqlMutations } from './app/integration/gql/integration.gql.mutations';
import { NewsArticleGqlMutations } from './app/news-article/gql/news-article.gql.mutations';
import { NpmsDashboardItemGqlMutations } from './app/npms-dashboard-item/gql/npms-dashboard-item.gql.mutations';
import { NpmsDashboardGqlMutations } from './app/npms-dashboard/gql/npms-dashboard.gql.mutations';
import { NpmsPackageGqlMutations } from './app/npms-package/gql/npms-package.gql.mutations';
import { RolePermissionGqlMutations } from './app/role-permission/gql/role-permission.gql.mutations';
import { RoleGqlMutations } from './app/role/gql/role.gql.mutations';
import { UserGqlMutations } from './app/user/gql/user.gql.mutations';
import { UserEmailGqlMutations } from './app/user/gql/user-email.gql.mutations';
import { GqlContext } from './common/context/gql.context';
import { unthunk } from './common/helpers/unthunk.helper';
import { FileGqlMutations } from './app/file/gql/file.gql.mutations';
import { EmailGqlMutations } from './app/email/email.gql.mutations';
import { ImageGqlMutations } from './app/image/gql/image.gql.mutations';

export const GqlRootMutation = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootMutationType',
  fields: () => ({
    ...unthunk(BlogPostGqlMutations),
    ...unthunk(BlogPostCommentGqlMutations),
    ...unthunk(NewsArticleGqlMutations),
    ...unthunk(NpmsPackageGqlMutations),
    ...unthunk(NpmsDashboardGqlMutations),
    ...unthunk(NpmsDashboardItemGqlMutations),
    ...unthunk(RolePermissionGqlMutations),
    ...unthunk(RoleGqlMutations),
    ...unthunk(UserGqlMutations),
    ...unthunk(UserEmailGqlMutations),
    ...unthunk(IntegrationGqlMutations),
    ...unthunk(GoogleGqlMutations),
    ...unthunk(AuthGqlMutations),
    ...unthunk(FileGqlMutations),
    ...unthunk(ImageGqlMutations),
    ...unthunk(EmailGqlMutations),
  }),
});
