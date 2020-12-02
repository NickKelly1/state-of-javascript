
export const NpmsDashboardStatus = {
  Draft: 10,
  Rejected: 20,
  Submitted: 30,
  Unpublished: 40,
  Published: 50,
} as const;
export type NpmsDashboardStatus = typeof NpmsDashboardStatus;
export type ANpmsDashboardStatus = NpmsDashboardStatus[keyof NpmsDashboardStatus];