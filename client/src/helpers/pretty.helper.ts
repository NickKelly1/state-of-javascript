export function pretty(json: any): string {
  return JSON.stringify(json, null, 2);
}