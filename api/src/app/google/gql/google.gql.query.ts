import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "../../integration/gql/integration.gql.node";
import { Integration } from "../../integration/integration.const";
import { GoogleGqlNode, IGoogleGqlNodeSource } from "./google.gql.node";

export const GoogleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get the google integration
   */
  google: {
    type: GraphQLNonNull(GoogleGqlNode),
    resolve: async (parent, args, ctx): Promise<IGoogleGqlNodeSource> => {
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
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model = await ctx.services.integrationRepository.findByPkOrfail(Integration.Google, { runner });
        ctx.authorize(ctx.services.googlePolicy.canOAuth2({ model: model }));
        const client = await ctx.services.googleService.oauthClient({ model, runner });
        const url = ctx.services.googleService.oauth2Url({ model, client, runner, });
        return url;
      });
      return final;
    }
  },
});