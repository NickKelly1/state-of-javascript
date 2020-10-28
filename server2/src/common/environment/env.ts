import dotenv from 'dotenv';
import { constTrue } from 'fp-ts/lib/function';
import path from 'path';
import { ROOT_DIR, SRC_DIR } from '../../dir';
import { Extractor } from '../helpers/extractor.helper';
import { OrUndefined } from '../types/or-undefined.type';

dotenv.config();

const to = Extractor({ fromObj: process.env, fromName: 'Environment variable' });

export class EnvService {
  is_dev(): boolean { return this.NODE_ENV === 'development'; };
  is_testing(): boolean { return this.NODE_ENV === 'testing'; };
  is_prod(): boolean { return this.NODE_ENV === 'production'; };


  public readonly HOST = to.string('HOST');
  public readonly NODE_ENV = to.oneOf(['production', 'testing', 'development'])('NODE_ENV');
  public readonly PORT = to.int('PORT');

  public readonly PG_USER: string;
  public readonly PG_PSW: string;
  public readonly PG_DB: string;
  public readonly PG_PORT: number;
  public readonly PG_HOST: string;

  public readonly PSW_SALT_ROUNDS = to.int('PSW_SALT_ROUNDS');
  public readonly LOG_DIR = to.string('LOG_DIR');
  public readonly LOG_MAX_SIZE = to.string('LOG_MAX_SIZE');
  public readonly LOG_ROTATION_MAX_AGE = to.string('LOG_ROTATION_MAX_AGE');
  public readonly JWT_SECRET = to.string('JWT_SECRET');
  public readonly ACCESS_TOKEN_EXPIRES_IN_MS = to.int('ACCESS_TOKEN_EXPIRES_IN_MS');
  public readonly REFRESH_TOKEN_EXPIRES_IN_MS = to.int('REFRESH_TOKEN_EXPIRES_IN_MS');
  public readonly DELAY = to.int('DELAY');

  public readonly EXT = path.extname(__filename);
  public readonly ROOT_DIR = ROOT_DIR;
  public readonly SRC_DIR = SRC_DIR;
  public readonly MIGRATIONS_DIR = path.join(SRC_DIR, '/migrations');

  constructor() {
    if (this.is_testing()) {
      this.PG_USER = to.string('TESTING_PG_USER');
      this.PG_PSW = to.string('TESTING_PG_PSW');
      this.PG_DB = to.string('TESTING_PG_DB');
      this.PG_PORT = to.int('TESTING_PG_PORT');
      this.PG_HOST = to.string('TESTING_PG_HOST');
    }

    else if (this.is_dev()) {
      this.PG_USER = to.string('DEV_PG_USER');
      this.PG_PSW = to.string('DEV_PG_PSW');
      this.PG_DB = to.string('DEV_PG_DB');
      this.PG_PORT = to.int('DEV_PG_PORT');
      this.PG_HOST = to.string('DEV_PG_HOST');
    }

    else if (this.is_prod()) {
      this.PG_USER = to.string('PROD_PG_USER');
      this.PG_PSW = to.string('PROD_PG_PSW');
      this.PG_DB = to.string('PROD_PG_DB');
      this.PG_PORT = to.int('PROD_PG_PORT');
      this.PG_HOST = to.string('PROD_PG_HOST');
    }

    else {
      throw new Error(`unhandled environment "${this.NODE_ENV}"`);
    }
  }
}

export const EnvServiceSingleton = new EnvService();
