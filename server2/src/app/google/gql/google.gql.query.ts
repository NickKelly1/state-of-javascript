import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "../../integration/gql/integration.gql.node";
import { Integration } from "../../integration/integration.const";

export const GoogleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get the google integration
   */
  googleIntegration: {
    type: GraphQLNonNull(IntegrationGqlNode),
    resolve: async (parent, args, ctx): Promise<IIntegrationGqlNodeSource> => {
      const model = await ctx.services.integrationRepository.findByPkOrfail(
        Integration.Google,
        { runner: null, }
      );
      ctx.authorize(ctx.services.integrationPolicy.canFindOne({ model }));
      return model;
    },
  },

  /**
   * Get a url to provide the app authentication with google
   */
  googleOAuth2GetUrl: {
    type: GraphQLNonNull(GraphQLString),
    resolve: async (parent, args, ctx): Promise<string> => {
      ctx.authorize(ctx.services.integrationPolicy.canAuthenticateGoogle());
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model = await ctx.services.integrationRepository.findByPkOrfail(Integration.Google, { runner });
        const client = await ctx.services.googleService.oauthClient({ model, runner });
        const url = ctx.services.googleService.oauth2Url({ model, client, runner, });
        return url;
      });
      return final;
    }
  },
});