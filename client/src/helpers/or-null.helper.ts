import { OrNullable } from "../types/or-nullable.type";

export function orNull<T>(arg: T | null | undefined): T | null { return arg === undefined ? null : arg};