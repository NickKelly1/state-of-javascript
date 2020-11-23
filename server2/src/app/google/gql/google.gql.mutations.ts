import { isLeft } from "fp-ts/lib/These";
import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString, Thunk } from "graphql";
import { Op } from "sequelize";
import { RoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { GqlJsonObjectScalar } from "../../../common/gql/gql.json.scalar";
import { IJson } from "../../../common/interfaces/json.interface";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "../../integration/gql/integration.gql.node";
import { Integration } from "../../integration/integration.const";
import { GoogleSendEmailGqlInput, GoogleSendEmailGqlInputValidator } from "../dtos/google.send-email.gql";
import { IGoogleIntegrationServiceSendEmailDto } from "../dtos/google.service.send-email-dto";

export const GoogleGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Provide the code given by the OAuth2 url to authenticate with google
   */
  googleOAuth2HandleCode: {
    type: GraphQLNonNull(IntegrationGqlNode),
    args: { code: { type: GraphQLNonNull(GraphQLString) } },
    resolve: async (parent, args, ctx): Promise<IIntegrationGqlNodeSource> => {
      const code: string = args.code;
      ctx.authorize(ctx.services.integrationPolicy.canAuthenticateGoogle());
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model = await ctx.services.integrationRepository.findByPkOrfail(Integration.Google, { runner });
        const client = await ctx.services.googleService.oauthClient({ model, runner, });
        await ctx.services.googleService.handleOAuth2Code({ model, client, code, runner });
        return model;
      });
      return final;
    }
  },

  /**
   * Send an email using google (gmail)
   */
  googleSendEmail: {
    type: GraphQLNonNull(GqlJsonObjectScalar),
    args: { dto: { type: GraphQLNonNull(GoogleSendEmailGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IJson> => {
      const dto = ctx.validate(GoogleSendEmailGqlInputValidator, args.dto);
      ctx.authorize(ctx.services.integrationPolicy.canSendGmails());
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model = await ctx.services.integrationRepository.findByPkOrfail(Integration.Google, { runner });
        const serviceDto: IGoogleIntegrationServiceSendEmailDto = {
          subject: dto.subject,
          to: dto.to,
          cc: dto.cc ?? undefined,
          body: dto.body,
        };
        const result = await ctx.services.googleService.sendEmail({ model, runner, dto: serviceDto });
        return result;
      });
      return final as IJson;
    },
  },
});
