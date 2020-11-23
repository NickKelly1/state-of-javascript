import md5 from 'md5';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from '../../common/logger/logger';
import { prettyQ } from '../../common/helpers/pretty.helper';

export class EncryptionService {
  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    //
  }


  /**
   * Encryption Secret
   */
  protected get cryptoSecret() {
    return this.universal.env.SECRET.substr(0, 32);
  }


  /**
   * Algorithm for encryption
   *
   * Don't change this...
   */
  protected get cryptoAlgorithm() {
    return 'aes-256-ctr';
  }


  /**
   * Md5 hash
   *
   * @param arg
   */
  md5Hash(arg: { value: string }): string {
    const { value } = arg;
    const hash = md5(value);
    return hash;
  }


  /**
   * Bcrypt Hash
   *
   * @param arg
   */
  async bcryptHash(arg: { raw: string, rounds: number }): Promise<string> {
    const { raw, rounds, } = arg;
    const hash = await bcryptjs.hash(raw, rounds);
    return hash;
  }


  /**
   * Bcrypt Compare
   *
   * @param arg
   */
  async bcryptCompare(arg: { raw: string, hash: string  }): Promise<boolean> {
    const { raw, hash } = arg;
    const comparison = await bcryptjs.compare(raw, hash);
    return comparison;
  }


  /**
   * Get a random byte array
   */
  iv(): string {
    return crypto.randomBytes(16).toString('hex');
  }


  /**
   * Encrypt a string
   *
   * @param raw
   *
   * https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
   */
  encrypt(arg: { decrypted: string; iv: string; }): string {
    const { decrypted, iv } = arg;
    logger.debug('ENCRYPTING: ' + prettyQ(arg));
    const cipher = crypto.createCipheriv(this.cryptoAlgorithm, this.cryptoSecret, Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([cipher.update(decrypted), cipher.final()]);
    return encrypted.toString('hex');
  }


  /**
   * Decrypt a string
   *
   * @param arg
   *
   * https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
   */
  decrypt(arg: { iv: string; encrypted: string; }): string {
    const { iv, encrypted } = arg;
    const decipher = crypto.createDecipheriv(this.cryptoAlgorithm, this.cryptoSecret, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex'))]);
    return decrypted.toString();
  }
};
