import { GraphQLEnumType } from "graphql";

export const JobStatusGqlEnum = {
  Active: 'Active',
  Completed: 'Completed',
  Delayed: 'Delayed',
  Failed: 'Failed',
  Paused: 'Paused',
  Waiting: 'Waiting',
} as const;
export type JobStatusGqlEnum = typeof JobStatusGqlEnum;
export type AJobStatusGqlEnum = JobStatusGqlEnum[keyof JobStatusGqlEnum];
export const JobStatusGqlEnums: AJobStatusGqlEnum[] = Object.values(JobStatusGqlEnum);

export const JobStatusGqlEnumType = new GraphQLEnumType({
  name: 'JobStatus',
  values: {
    Active: { value: JobStatusGqlEnum.Active, },
    Completed: { value: JobStatusGqlEnum.Completed, },
    Delayed: { value: JobStatusGqlEnum.Delayed, },
    Failed: { value: JobStatusGqlEnum.Failed, },
    Paused: { value: JobStatusGqlEnum.Paused, },
    Waiting: { value: JobStatusGqlEnum.Waiting, },
  },
});