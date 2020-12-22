import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { Integration } from "../../integration/integration.const";
import { GoogleGqlNode, IGoogleGqlNodeSource } from "./google.gql.node";
import { GoogleLang } from '../google.lang';
import { IntegrationLang } from "../../integration/integration.lang";

export const GoogleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get the google integration
   */
  google: {
    type: GraphQLNonNull(GoogleGqlNode),
    resolve: async (parent, args, ctx): Promise<IGoogleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.integrationPolicy.canAccess(), IntegrationLang.CannotAccess);
      // find
      const model = await ctx.services.integrationRepository.findByPkOrfail(
        Integration.Google,
        { runner: null, }
      );
      // authorise view
      ctx.services.integrationRepository._404Unless(ctx.services.integrationPolicy.canFindOne({ model }));
      return model;
    },
  },

  /**
   * Get a url to provide the app authentication with google
   */
  googleOAuth2GetUrl: {
    type: GraphQLNonNull(GraphQLString),
    resolve: async (parent, args, ctx): Promise<string> => {
      // authorise access
      ctx.authorize(ctx.services.integrationPolicy.canAccess(), IntegrationLang.CannotAccess);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.integrationRepository.findByPkOrfail(Integration.Google, { runner });
        // authorise oauth2
        ctx.authorize(ctx.services.googlePolicy.canOAuth2({ model: model }), GoogleLang.CannotOAuth2);
        // do oauth2
        const client = await ctx.services.googleService.oauthClient({ model, runner });
        const url = ctx.services.googleService.oauth2Url({ model, client, runner, });
        return url;
      });
      return final;
    }
  },
});