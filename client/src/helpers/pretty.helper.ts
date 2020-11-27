export function pretty(json: any): string {
  return JSON.stringify(json, null, 2);
}

export function pretty2(json: any): string {
  if (typeof json === 'object' && json && typeof json.toJSON === 'object' && json.toJSON.length === 0) return pretty(json);
  return pretty(json);
}