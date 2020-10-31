import md5 from 'md5';
import bcryptjs from 'bcryptjs';
import { IRequestContext } from '../../common/interfaces/request-context.interface';

export class HashService {
  constructor(
    //
  ) {
    //
  }

  md5Hash(arg: { value: string }): string {
    const { value } = arg;
    const hash = md5(value);
    return hash;
  }

  async bcryptHash(arg: { raw: string, rounds: number }): Promise<string> {
    const { raw, rounds, } = arg;
    const hash = await bcryptjs.hash(raw, rounds);
    return hash;
  }

  async bcryptCompare(arg: { raw: string, hash: string  }): Promise<boolean> {
    const { raw, hash } = arg;
    const comparison = await bcryptjs.compare(raw, hash);
    return comparison;
  }
};
