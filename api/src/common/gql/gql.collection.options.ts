import Joi from "joi";
import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { OrNullable } from "../types/or-nullable.type";
import { GqlFilterFieldType, GqlFilterInputFactory, IGqlFilterGroup } from "./gql.filter.types";
import { IGqlSortInput, GqlSortInput, GqlDirEnum } from "./gql.sort.enum";

export interface IGqlCollectionOptions {
  offset?: OrNullable<number>;
  limit?: OrNullable<number>;
  sorts?: OrNullable<IGqlSortInput[]>;
  filter?: OrNullable<IGqlFilterGroup[]>;
}

export const GqlCollectionOptionsInputFactory = (arg: {
  name: string,
  filters: Record<string, GqlFilterFieldType>,
}): GraphQLInputObjectType => {
  const Obj: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: `${arg.name}Query`,
    fields: () => ({
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      sorts: { type: GraphQLList(GraphQLNonNull(GqlSortInput)) },
      filter: { type: GraphQLList(GraphQLNonNull(GqlFilterInputFactory({
        name: `${arg.name}QueryFilter`,
        fields: arg.filters,
      }))) },
    }),
  });
  return Obj;
}

export const CollectionOptionsValidator = Joi.object<IGqlCollectionOptions>({
  offset: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional(),
  // sorts
  sorts: Joi.array().items(Joi.object({
    field: Joi.string().required(),
    dir: Joi.alternatives([ GqlDirEnum.Asc, GqlDirEnum.Desc, ]).required(),
  }).required()).optional(),
  // too complicated... don't bother validating filter...
  filter: Joi.alternatives([Joi.array(), Joi.object()]).optional(),
});