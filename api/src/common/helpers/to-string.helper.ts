export function toString(arg: any): string {
  try {
    return String(arg);
  } catch (error) {
    return '_unprintable_';
  }
}