export function ucFirst(str: string): string {
  if (!str) return str;
  if (str.length === 1) return str.toUpperCase();
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1, str.length)}`
}