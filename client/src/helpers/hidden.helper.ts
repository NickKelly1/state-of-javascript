/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hide(boolean: boolean): string {
  if (boolean) return 'visibility-hidden';
  return 'visibility-inherit';
}

/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hidey(boolean: boolean): string {
  if (boolean) return 'visibility-hidden-y';
  return 'visibility-inherit';
}

/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hidex(boolean: boolean): string {
  if (boolean) return 'visibility-hidden-x';
  return 'visibility-inherit';
}