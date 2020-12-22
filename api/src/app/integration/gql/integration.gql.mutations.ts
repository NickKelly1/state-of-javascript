import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IIntegrationServiceInitialiseIntegrationCredentialsDto } from "../dtos/integration-service.initialise-integration-credentials.dto";
import { InitialiseIntegrationGqlInput, InitialiseIntegrationGqlInputValidator } from "../dtos/update-integration-credentials.gql";
import { IntegrationLang } from "../integration.lang";
import { IntegrationModel } from "../integration.model";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "./integration.gql.node";

export const IntegrationGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  initialiseIntegration: {
    type: GraphQLNonNull(IntegrationGqlNode),
    args: { dto: { type: GraphQLNonNull(InitialiseIntegrationGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IIntegrationGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.integrationPolicy.canAccess(), IntegrationLang.CannotAccess);
      // validate
      const dto = ctx.validate(InitialiseIntegrationGqlInputValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: IntegrationModel = await ctx.services.integrationRepository.findByPkOrfail(dto.id, { runner, });
        // authorise initialise
        ctx.authorize(
          ctx.services.integrationPolicy.canInititialiseOne({ model }),
          IntegrationLang.CannotInitialise({ model }),
        );
        const serviceDto: IIntegrationServiceInitialiseIntegrationCredentialsDto = {
          init: dto.init,
        };
        // do initialise
        await ctx.services.integrationService.initialiseIntegration({ runner, dto: serviceDto, model });
        return model;
      });
      return model;
    },
  },
});
