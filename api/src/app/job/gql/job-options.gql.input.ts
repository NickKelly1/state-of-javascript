import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import Joi from "joi";
import { AJobStatusGqlEnum, JobStatusGqlEnum, JobStatusGqlEnums, JobStatusGqlEnumType } from "../../../common/gql/job-status.gql.enum";
import { OrNullable } from "../../../common/types/or-nullable.type";

export interface IJobOptionsGqlInput {
  statuses?: OrNullable<AJobStatusGqlEnum[]>;
  start?: OrNullable<number>;
  end?: OrNullable<number>;
  asc?: OrNullable<boolean>;
}

export const JobOptionsGqlInput = new GraphQLInputObjectType({
  name: 'JobOptions',
  fields: () => ({
    statuses: { type: GraphQLList(GraphQLNonNull(JobStatusGqlEnumType)), },
    start: { type: GraphQLInt, },
    end: { type: GraphQLInt, },
    asc: { type: GraphQLBoolean, },
  }),
});

export const JobOptionsGqlInputValidator = Joi.object<IJobOptionsGqlInput>({
  statuses: Joi.array().items(Joi.alternatives(...JobStatusGqlEnums).required()).optional(),
  start: Joi.number().integer().positive().optional(),
  end: Joi.number().integer().positive().optional(),
  asc: Joi.bool().optional(),
});