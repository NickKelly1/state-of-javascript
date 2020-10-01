import { OrNull } from "../types/or-null.type";

export interface NormalisedError {
  status: OrNull<number>;
  message: string;
}

export function normaliseError(unknown: unknown): NormalisedError {
  if (typeof unknown === 'object' && unknown !== null) {
    const obj = unknown as  Record<any, unknown>;
    const message = typeof obj.message === 'string' ? obj.message : 'An unknown error occured';
    const status = typeof obj.status === 'number' ? obj.status : null;
    return {
      status: status,
      message,
    }
  }
  return {
    status: null,
    message: 'An unknown error occured',
  }
}