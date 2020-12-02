import qs from 'qs';
import getConfig from 'next/config';
import ReactGA from 'react-ga';
import { OrUndefined } from '../types/or-undefined.type';

const config = getConfig();
const envHost = config.publicRuntimeConfig;

function fail(msg: string): never {
  throw new TypeError(msg);
}

function failIf(cond: boolean) {
  return function(msg: string) {
    if (cond) fail(msg);
  }
}

function string(name: string): string {
  const raw = envHost[name];
  if (raw === undefined) fail(`Failed to parse env variable "${name}": undefined`);
  const str: string = raw;
  return str;
}

function float(name: string): number {
  const raw = envHost[name];
  if (raw === undefined) fail(`Failed to parse env variable "${name}": undefined`);
  const num = Number(raw);
  if (Number.isNaN(num)) fail(`Failed to parse env variable "${name}": not a number`);
  return num;
}

function integer(name: string): number {
  const raw = envHost[name];
  if (raw === undefined) fail(`Failed to parse env variable "${name}": undefined`);
  const int = parseInt(raw, 10);
  if (Number.isNaN(int)) fail(`Failed to parse env variable "${name}": not an integer`);
  return int;
}

function boolean(name: string): boolean {
  const raw = envHost[name];
  if (raw === undefined) fail(`Failed to parse env variable "${name}": undefined`);
  const bool =
    raw.trim() === '1' ? true
    : raw.toLowerCase().trim() === 'true' ? true
    : raw.trim() === '0' ? false
    : raw.toLowerCase().trim() === 'false' ? false
    : undefined;
  if (bool === undefined) fail(`Failed to parse env variable "${name}": not a boolean`);
  return bool;
}

function oneOf<T extends string>(name: string, oneOf: T[]): T {
  const raw = envHost[name];
  if (raw === undefined) fail(`Failed to parse env variable "${name}": undefined`);
  if (!oneOf.includes(raw as T)) fail(`Failed to parse env variable "${name}": not one of "${oneOf.join('", "')}"`);
  return raw as T;
}

export class PublicEnv {
  static create(): PublicEnv { return new PublicEnv(); }
  // public readonly NODE_ENV = oneOf('NODE_ENV', ['development', 'testing', 'production']);
  public readonly GA_ID = string('GA_ID');
  public readonly CMS_URL = string('CMS_URL');
  public readonly API_URL = string('API_URL');
  public readonly API_AUTH_REFRESH_ATTEMPT_COUNT = integer('API_AUTH_REFRESH_ATTEMPT_COUNT');
  public readonly API_AUTH_REFRESH_ATTEMPT_PAUSE_MS = integer('API_AUTH_REFRESH_ATTEMPT_PAUSE_MS');
  public readonly API_AUTH_REFRESH_LEEWAY_MS = integer('API_AUTH_REFRESH_LEEWAY_MS');
  toJSON(): PublicEnv {
    return { ...this };
  }
}

export const PublicEnvSingleton = PublicEnv.create();

// Google analytics
const ga_id = PublicEnvSingleton.GA_ID;
export let GA: OrUndefined<typeof ReactGA>;;
if (ga_id) {
  GA = ReactGA;
  GA.initialize(ga_id);
}

export enum GAEventCategory {
  authentication = 'authentication',
  routing = 'routing',
};
