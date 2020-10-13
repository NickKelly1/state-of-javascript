
export const Language = {
  En: 'en',
  Ger: 'ger',
} as const;
export type Language = typeof Language;
export type ALanguage = Language[keyof Language];
export const Languages = Object.values(Language);
