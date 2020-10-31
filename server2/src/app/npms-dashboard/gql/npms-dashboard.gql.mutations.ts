import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { CreateNpmsDashboardGqlInput, CreateNpmsDashboardValidator } from "../dtos/create-npms-dashboard.gql";
import { DeleteNpmsDashboardGqlInput, DeleteNpmsDashboardValidator } from "../dtos/delete-npms-dashboard.gql";
import { UpdateNpmsDashboardGqlInput, UpdateNpmsDashboardValidator } from "../dtos/update-npms-dashboard.gql";
import { INpmsDashboardGqlNodeSource, NpmsDashboardGqlNode } from "./npms-dashboard.gql.node";

export const NpmsDashboardGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canCreate());
      const dto = ctx.validate(CreateNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard = await ctx.services.npmsDashboardService.create({ runner, dto });
        return npmsDashboard;
      });
      return model;
    },
  },

  updateNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(UpdateNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canUpdate({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.update({ runner, dto, model: npmsDashboard });
        return npmsDashboard;
      });
      return model;
    },
  },

  deleteNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(DeleteNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(DeleteNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canDelete({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.delete({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return model;
    },
  },
});