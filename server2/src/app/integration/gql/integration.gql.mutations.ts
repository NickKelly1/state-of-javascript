import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IIntegrationServiceInitialiseIntegrationCredentialsDto } from "../dtos/integration-service.initialise-integration-credentials.dto";
import { InitialiseIntegrationGqlInput, InitialiseIntegrationGqlInputValidator } from "../dtos/update-integration-credentials.gql";
import { IntegrationModel } from "../integration.model";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "./integration.gql.node";

export const IntegrationGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  initialiseIntegration: {
    type: GraphQLNonNull(IntegrationGqlNode),
    args: { dto: { type: GraphQLNonNull(InitialiseIntegrationGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IIntegrationGqlNodeSource> => {
      const dto = ctx.validate(InitialiseIntegrationGqlInputValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: IntegrationModel = await ctx.services.integrationRepository.findByPkOrfail(dto.id, { runner, });
        ctx.authorize(ctx.services.integrationPolicy.canInititialiseOne({ model }));
        const serviceDto: IIntegrationServiceInitialiseIntegrationCredentialsDto = {
          init: dto.init,
        };
        await ctx.services.integrationService.initialiseIntegration({ runner, dto: serviceDto, model });
        return model;
      });
      return model;
    },
  },
});
