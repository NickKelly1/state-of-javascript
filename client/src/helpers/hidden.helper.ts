import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";

/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hide(boolean?: OrNullable<boolean>): string {
  if (!!boolean) return 'visibility-hidden';
  return 'visibility-inherit';
}

/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hidey(boolean?: OrNullable<boolean>): string {
  if (!!boolean) return 'visibility-hidden-y';
  return 'visibility-inherit';
}

/**
 * Return a css class to affect visibility
 *
 * @param boolean
 */
export function hidex(boolean?: OrNullable<boolean>): string {
  if (!!boolean) return 'visibility-hidden-x';
  return 'visibility-inherit';
}