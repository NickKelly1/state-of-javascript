import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";
import { isoFetch } from "../iso-fetch";

export class NpmsApiConnector {
  protected readonly url = 'https://api.npms.io';

  static create(arg: { publicEnv: PublicEnv; }): NpmsApiConnector {
    const { publicEnv } = arg;
    return new NpmsApiConnector(publicEnv);
  }

  protected constructor(protected readonly publicEnv: PublicEnv) {}

  async json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let info: RequestInfo;
    if (typeof input === 'string') {
      info = `${this.url}${input}`;
      Debug.NpmsConnector(`[${this.json.name}] "${info}"`);
    } else {
      info = {
        ...input,
        url: `${this.url}${input.url}`,
      };
      Debug.NpmsConnector(`[${this.json.name}] "${info.url}"`);
    }
    const response = await isoFetch(info, init);
    const json: T = await response.json();
    if (!response.ok) throw json;
    return json;
  }
}