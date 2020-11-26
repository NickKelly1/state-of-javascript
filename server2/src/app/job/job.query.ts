import { GraphQLEnumType, GraphQLFieldConfigMap, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Thunk } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { GqlJsonObjectScalar } from "../../common/gql/gql.json.scalar";
import { IJson } from "../../common/interfaces/json.interface";
import { Job, JobOptions, JobStatus } from 'bull';
import Joi from "joi";
import { IJobOptionsGqlInput, JobOptionsGqlInput, JobOptionsGqlInputValidator } from "./gql/job-options.gql.input";
import { OrNullable } from "../../common/types/or-nullable.type";
import { ist } from "../../common/helpers/ist.helper";
import { JobStatusGqlEnum } from "../../common/gql/job-status.gql.enum";
import { OrNull } from "../../common/types/or-null.type";
import { ABullJobStatus, BullJobStatus } from "../../common/constants/job-status.const";
import { IGmailJob } from "../google/gmail.job.interface";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { Printable } from "../../common/types/printable.type";



type IJobGqlNodeOptionsSource = JobOptions;
const JobGqlNodeOptions = new GraphQLObjectType<IJobGqlNodeOptionsSource, GqlContext>({
  name: 'JobNodeOptions',
  fields: () => ({
    attempts: { type: GraphQLNonNull(GraphQLInt), resolve: (parent) => parent.attempts, },
    backoff: { type: GqlJsonObjectScalar, resolve: (parent): OrUndefined<IJson> => parent.backoff, },
    delay: { type: GraphQLFloat, resolve: (parent): OrUndefined<IJson> => parent.delay, },
  }),
});

type IJobGqlNodeSource = ReturnType<Job['toJSON']>;
const JobGqlNode = new GraphQLObjectType<IJobGqlNodeSource, GqlContext>({
  name: 'JobNode',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.id.toString(), },
    name: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.name, },
    data: { type: GqlJsonObjectScalar, resolve: (parent): unknown => parent.data, },
    opts: { type: GraphQLNonNull(JobGqlNodeOptions), resolve: (parent) => parent.opts, },
    progress: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent) => parent.progress, },
    delay: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent) => parent.delay, },
    timestamp: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent.timestamp, },
    attemptsMade: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent.attemptsMade, },
    stacktrace: { type: GraphQLList(GraphQLNonNull(GraphQLString)), resolve: (parent): OrNull<string[]> => parent.stacktrace, },
    stacktrace2: { type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))), resolve: (parent): OrNull<string[][]> => parent.stacktrace?.map(stk => stk.split('\n')) ?? null, },
    returnvalue: { type: GqlJsonObjectScalar, resolve: (parent): IJson => parent.returnvalue, },
    finishedOn: { type: GraphQLFloat, resolve: (parent): OrNull<number> => parent.finishedOn, },
    processedOn: { type: GraphQLFloat, resolve: (parent): OrNull<number> => parent.processedOn, },
  }),
});

export const JobGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  gmailJobs: {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(JobGqlNode))),
    args: { query: { type: JobOptionsGqlInput, }, },
    resolve: async (parent, args, ctx): Promise<IJobGqlNodeSource[]> => {
      const query: OrNullable<IJobOptionsGqlInput> = ist.defined(args)
        ? ctx.validate(JobOptionsGqlInputValidator, args.query)
        : null;
      const statuses: JobStatus[]  = (query
        ?.statuses ?? [])
        .map((status): OrNull<JobStatus> => {
          if (status === JobStatusGqlEnum.Active) return BullJobStatus.active;
          if (status === JobStatusGqlEnum.Completed) return BullJobStatus.completed;
          if (status === JobStatusGqlEnum.Delayed) return BullJobStatus.delayed;
          if (status === JobStatusGqlEnum.Failed) return BullJobStatus.failed;
          if (status === JobStatusGqlEnum.Paused) return BullJobStatus.paused;
          if (status === JobStatusGqlEnum.Waiting) return BullJobStatus.waiting;
          return null;
        })
        .filter(ist.notNullable);
      const start = query?.start ?? undefined;
      const end = query?.end ?? undefined;
      const asc = query?.asc ?? undefined;
      const jobs: Array<Job<IGmailJob>> = await ctx.services.universal.gmailQueue.getJobs(statuses, start, end, asc);
      return jobs.map((job): IJobGqlNodeSource => job.toJSON());
    },
  },
  // gmailJobLogs: {
  //   type: GqlJsonObjectScalar,
  //   resolve: async (parent, args, ctx): Promise<IJson> => {
  //     const jobs = ctx.services.universal.gmailQueue.getJobLogs(jobId);
  //     return jobs as any as IJson;
  //   },

  //   //
  // },

  // erroredJobs: {
  //   //
  // },
  // completedJobs: {
  //   //
  // },
});
