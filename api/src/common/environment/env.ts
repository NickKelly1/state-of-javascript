import dotenv from 'dotenv';
import { constTrue } from 'fp-ts/lib/function';
import path from 'path';
import { ROOT_DIR, SRC_DIR } from '../../root';
import { Extractor } from '../helpers/extractor.helper';
import { OrUndefined } from '../types/or-undefined.type';

// optional ENV_FILE can be provided...
dotenv.config({ path: process.env.ENV_FILE });

const to = Extractor({ fromObj: process.env, fromName: 'Environment variable' });

export class EnvService {
  is_master(): boolean { return this.MASTER === true; };

  is_dev(): boolean { return this.NODE_ENV === 'development'; };
  is_testing(): boolean { return this.NODE_ENV === 'testing'; };
  is_prod(): boolean { return this.NODE_ENV === 'production'; };


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

  public readonly PSW_SALT_ROUNDS = to.int('PSW_SALT_ROUNDS');
  public readonly LOG_DIR = to.string('LOG_DIR');
  public readonly LOG_MAX_SIZE = to.string('LOG_MAX_SIZE');
  public readonly LOG_ROTATION_MAX_AGE = to.string('LOG_ROTATION_MAX_AGE');
  public readonly LOG_HTTP_HEADERS = to.bool('LOG_HTTP_HEADERS');
  public readonly JWT_SECRET = to.string('JWT_SECRET');
  public readonly ACCESS_TOKEN_EXPIRES_IN_MS = to.int('ACCESS_TOKEN_EXPIRES_IN_MS');
  public readonly REFRESH_TOKEN_EXPIRES_IN_MS = to.int('REFRESH_TOKEN_EXPIRES_IN_MS');
  public readonly DELAY = to.int('DELAY');

  public readonly DELAY = to.int('DELAY');

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

    // if (this.is_testing()) {
    //   this.PG_USER = to.string('TEST_PG_USER');
    //   this.PG_PSW = to.string('TEST_PG_PSW');
    //   this.PG_DB = to.string('TEST_PG_DB');
    //   this.PG_PORT = to.int('TEST_PG_PORT');
    //   this.PG_HOST = to.string('TEST_PG_HOST');
    //   this.REDIS_PSW = to.string('TEST_REDIS_PSW');
    //   this.REDIS_HOST = to.string('TEST_REDIS_HOST');
    //   this.REDIS_PORT = to.int('TEST_REDIS_PORT');
    // }

    // else if (this.is_dev()) {
    //   this.PG_USER = to.string('DEV_PG_USER');
    //   this.PG_PSW = to.string('DEV_PG_PSW');
    //   this.PG_DB = to.string('DEV_PG_DB');
    //   this.PG_PORT = to.int('DEV_PG_PORT');
    //   this.PG_HOST = to.string('DEV_PG_HOST');
    //   this.REDIS_PSW = to.string('DEV_REDIS_PSW');
    //   this.REDIS_HOST = to.string('DEV_REDIS_HOST');
    //   this.REDIS_PORT = to.int('DEV_REDIS_PORT');
    // }

    // else if (this.is_prod()) {
    //   this.PG_USER = to.string('PROD_PG_USER');
    //   this.PG_PSW = to.string('PROD_PG_PSW');
    //   this.PG_DB = to.string('PROD_PG_DB');
    //   this.PG_PORT = to.int('PROD_PG_PORT');
    //   this.PG_HOST = to.string('PROD_PG_HOST');
    //   this.REDIS_PSW = to.string('PROD_REDIS_PSW');
    //   this.REDIS_HOST = to.string('PROD_REDIS_HOST');
    //   this.REDIS_PORT = to.int('PROD_REDIS_PORT');
    // }

    // else {
    //   throw new Error(`unhandled environment "${this.NODE_ENV}"`);
    // }
  }
}

export const EnvServiceSingleton = new EnvService();
