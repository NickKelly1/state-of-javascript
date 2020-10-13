import dotenv from 'dotenv';

dotenv.config();

const from = process.env;
function extract(name: string): string | undefined { return from[name] };
function extractAssert(name: string): string {
  const val = extract(name);
  if (val === undefined) throw new ReferenceError(`Environment variable "${name}" must be defined`);
  return val;
}

const to = {
  string(name: string): string {
    const val = extractAssert(name);
    return val;
  },
  number(name: string): number {
    const val = Number(extractAssert(name));
    if (!Number.isFinite(val)) throw new TypeError(`Environment variable "${name}" must be a number`);
    return val;
  },
  int(name: string): number {
    let val = parseInt(extractAssert(name), 10);
    if (!Number.isFinite(val)) throw new TypeError(`Environment variable "${name}" must be a number`);
    return val;
  },
  bool(name: string): boolean {
    let raw = extractAssert(name).trim().toLowerCase();
    if (raw === 'true') return true;
    if (raw === '1') return true;
    if (raw === 'false') return false;
    if (raw === '0') return false;
    throw new TypeError(`Environment variable "${name}" must be a boolean`);
  },
  oneOf: <T extends string>(arg: T[]) => (name: string): T => {
    let val = extractAssert(name);
    if (!arg.some(acceptable => acceptable === val)) {
      throw new TypeError(`Environment variable "${name}" must be one of ${arg.map(String).join(', ')}`);
    }
    return val as T;
  },
  subsetOf: <T extends string>(arg: T[]) => (name: string): T[] => {
    let raw = extract(name) ?? '';
    const strs = raw.split(',').filter(Boolean);
    const extra = strs.filter(val => !arg.some(ar => ar === val));
    if (extra.length) throw new TypeError(`Environment variable "${name}" has unexpectd values: "${extra.join(',')}"`);
    return strs as T[];
  }
}


export const Env = {
  is_dev(): boolean { return Env.NODE_ENV === 'development'; },
  is_testing(): boolean { return Env.NODE_ENV === 'testing'; },
  is_prod(): boolean { return Env.NODE_ENV === 'production'; },
  NODE_ENV: to.oneOf(['production', 'testing', 'development'])('NODE_ENV'),
  // DEBUG: to.subsetOf(Object.values(DebugOpt))('DEBUG'),
  PORT: to.int('PORT'),
  PG_USER:  to.string('PG_USER'),
  PG_PSW:  to.string('PG_PSW'),
  PG_DB:  to.string('PG_DB'),
  PG_PORT:  to.int('PG_PORT'),
  PG_HOST:  to.string('PG_HOST'),
} as const;
export type Env = typeof Env;