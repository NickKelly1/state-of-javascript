import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { CreateNpmsPackageGqlInput, CreateNpmsPackageValidator } from "../dto/create-npms-package.gql";
import { NpmsPackageLang } from "../npms-package.lang";
import { INpmsPackageGqlNodeSource, NpmsPackageGqlNode } from "./npms-package.gql.node";

export const NpmsPackageGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create an NpmsPackage
   */
  createNpmsPackage: {
    type: GraphQLNonNull(NpmsPackageGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsPackageGqlInput) }, }, 
    resolve: async (parent, args, ctx): Promise<INpmsPackageGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.npmsPackagePolicy.canAccess(), NpmsPackageLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.npmsPackagePolicy.canCreate(), NpmsPackageLang.CannotCreate);
      const dto = ctx.validate(CreateNpmsPackageValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        // check constraints
        await ctx.services.npmsPackageService.checkConstraints({ runner, dataKey: 'name', dtos: [{ names: [dto.name] }]});
        // do create
        const [model] = await ctx.services.npmsPackageService.create({ runner, dto: { names: [dto.name] } });
        return model;
      });
      return model;
    },
  },
});