export const GoogleDefinition = {
  email: {
    subject: {
      min: 0,
      max: 100,
    },
    body: {
      min: 0,
      max: 10_000,
    },
  },
} as const;
