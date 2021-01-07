import { nanoid } from 'nanoid';
import { OrNullable } from '../types/or-nullable.type';
import { ist } from './ist.helper';

/**
 * Make an fs-safe filename
 */
export function filenameify(arg?: {
  name?: OrNullable<string>,
  prefix?: OrNullable<string>,
  suffix?: OrNullable<string>,
  extension?: OrNullable<string>;
}): string {
  const { suffix, prefix, name, extension: extension, } = arg ?? {};

  // nanoid is url-safe
  const out = [
    prefix ? fsSafe(prefix) : null,
    name ? fsSafe(name) : randomFileName(),
    suffix ? fsSafe(suffix) : null,
    extension ? `.${extension}` : null,
  ].filter(ist.defined).join('');

  return out;
}

export function fsSafe(str: string): string {
  return str
    // replace stuff that wouldn't be fs-safe
    .replace(/[^a-z0-9_.-]/gi, '_')
    // make lowercase just because...
    .toLowerCase();
}

export function randomFileName(): string {
  // fs-safe name, and without full-stops
  return fsSafe(nanoid()).replace(/\./g, '');
}
