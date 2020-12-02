export const Integration = {
  Google: 10,
} as const;
export type Integration = typeof Integration;
export type AnIntegration = Integration[keyof Integration];

