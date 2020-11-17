
export const NpmsDashboardStatus = {
  Draft: 10,
  Rejected: 20,
  Submitted: 30,
  Approved: 40,
  Unpublished: 50,
  Published: 60,
} as const;
export type NpmsDashboardStatus = typeof NpmsDashboardStatus;
export type ANpmsDashboardStatus = NpmsDashboardStatus[keyof NpmsDashboardStatus];