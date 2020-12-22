import dotenv from 'dotenv';
import path from 'path';
import { ROOT_DIR, SRC_DIR } from '../../root';
import { Extractor } from '../helpers/extractor.helper';

// optional ENV_FILE can be provided...
dotenv.config({ path: process.env.ENV_FILE });

const to = Extractor({ fromObj: process.env, fromName: 'Environment variable' });

export class EnvService {
  is_master(): boolean { return this.MASTER === true; }

  is_dev(): boolean { return this.NODE_ENV === 'development'; }
  is_testing(): boolean { return this.NODE_ENV === 'testing'; }
  is_prod(): boolean { return this.NODE_ENV === 'production'; }


  public readonly MASTER = to.bool('MASTER');

  public readonly PASSWORD_RESET_URI = to.string('PASSWORD_RESET_URI');
  public readonly WELCOME_URI = to.string('WELCOME_URI');
  public readonly VERIFY_EMAIL_URI = to.string('VERIFY_EMAIL_URI');
  public readonly VERIFY_EMAIL_CHANGE_URI = to.string('VERIFY_EMAIL_CHANGE_URI');


  public readonly HOST = to.string('HOST');
  public readonly NODE_ENV = to.oneOf(['production', 'testing', 'development'])('NODE_ENV');
  public readonly PORT = to.int('PORT');

  public readonly PG_USER: string;
  public readonly PG_PSW: string;
  public readonly PG_DB: string;
  public readonly PG_PORT: number;
  public readonly PG_HOST: string;

  public readonly REDIS_PSW: string;
  public readonly REDIS_HOST: string;
  public readonly REDIS_PORT: number;

  // default: 10
  public readonly PSW_SALT_ROUNDS = to.optional(() => to.int('PSW_SALT_ROUNDS')) ?? 10;

  // default: true
  public readonly GZIP_LOGS = to.optional(() => to.bool('GZIP_LOGS')) ?? true;

  // default: ./storage/logs
  public readonly LOG_DIR = to.optional(() => to.string('LOG_DIR')) ?? './storage/logs';

  // default: 20m
  public readonly LOG_MAX_SIZE = to.optional(() => to.string('LOG_MAX_SIZE')) ?? '20m';

  // default: 7d
  public readonly LOG_ROTATION_MAX_AGE = to.optional(() => to.string('LOG_ROTATION_MAX_AGE')) ?? '7d';

  // default: false
  public readonly LOG_HTTP_HEADERS = to.optional(() => to.bool('LOG_HTTP_HEADERS')) ?? false;

  public readonly JWT_SECRET = to.string('JWT_SECRET');

  // default: 5 min
  public readonly ACCESS_TOKEN_EXPIRES_IN_MS = to.optional(() => to.int('ACCESS_TOKEN_EXPIRES_IN_MS')) ?? 1000 * 60 * 5;

  // default: 30d
  public readonly REFRESH_TOKEN_EXPIRES_IN_MS = to.optional(() => to.int('REFRESH_TOKEN_EXPIRES_IN_MS')) ?? 1000 * 60 * 60 * 24 * 30;

  // default: 0
  public readonly DELAY = to.optional(() => to.int('DELAY')) ?? 0;

  // default: 1 min
  public readonly RATE_LIMIT_WINDOW_MS = to.optional(() => to.int('REFRESH_TOKEN_EXPIRES_IN_MS')) ?? 1000 * 60;

  // default: 300
  public readonly RATE_LIMIT_MAX = to.optional(() => to.int('DELAY')) ?? 500;

  public readonly SECRET = to.string('SECRET');

  public readonly ADMIN_INITIAL_PSW = to.string('ADMIN_INITIAL_PSW');

  public readonly EXT = path.extname(__filename);
  public readonly ROOT_DIR = ROOT_DIR;
  public readonly SRC_DIR = SRC_DIR;
  public readonly MIGRATIONS_DIR = path.join(SRC_DIR, '/migrations');
  public readonly SEEDERS_DIR = path.join(SRC_DIR, '/seeds');

  constructor() {
    this.REDIS_PSW = to.string('REDIS_PSW');
    this.REDIS_HOST = to.string('REDIS_HOST');
    this.REDIS_PORT = to.int('REDIS_PORT');

    this.PG_USER = to.string('PG_USER');
    this.PG_PSW = to.string('PG_PSW');
    this.PG_DB = to.string('PG_DB');
    this.PG_PORT = to.int('PG_PORT');
    this.PG_HOST = to.string('PG_HOST');
  }
}

export const EnvServiceSingleton = new EnvService();
