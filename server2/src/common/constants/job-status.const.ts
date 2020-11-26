import { JobStatus } from "bull";

export type ABullJobStatus = JobStatus;
export type BullJobStatus = { [K in JobStatus]: K };
export const BullJobStatus: BullJobStatus = {
  active: 'active',
  completed: 'completed',
  delayed: 'delayed',
  failed: 'failed',
  paused: 'paused',
  waiting: 'waiting',
};
export const BullJobStatuses = Object.values(BullJobStatus);