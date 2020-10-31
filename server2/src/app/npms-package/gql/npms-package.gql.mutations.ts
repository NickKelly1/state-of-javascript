import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { logger } from "../../../common/logger/logger";
import { CreateNpmsPackageGqlInput, CreateNpmsPackageValidator } from "../dto/create-npms-package.gql";
import { INpmsPackageGqlNodeSource, NpmsPackageGqlNode } from "./npms-package.gql.node";

export const NpmsPackageGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNpmsPackage: {
    type: GraphQLNonNull(NpmsPackageGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsPackageGqlInput) }, }, 
    resolve: async (parent, args, ctx): Promise<INpmsPackageGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsPackagePolicy.canCreate());
      const dto = ctx.validate(CreateNpmsPackageValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const [model] = await ctx.services.npmsPackageService.create({ runner, dto: { names: [dto.name] } });
        return model;
      });
      return model;
    },
  },
});