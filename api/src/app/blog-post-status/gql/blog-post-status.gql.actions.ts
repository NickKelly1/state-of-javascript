import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { BlogPostStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type IBlogPostStatusGqlActionsSource = BlogPostStatusModel;
export const BlogPostStatusGqlActions = new GraphQLObjectType<IBlogPostStatusGqlActionsSource, GqlContext>({
  name: 'BlogPostStatusActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostStatusPolicy.canFindOne({ model: parent });
      },
    },
  },
});
