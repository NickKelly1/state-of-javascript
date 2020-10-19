import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";

export class CmsConnector {
  static create(arg: { publicEnv: PublicEnv; }): CmsConnector {
    const { publicEnv } = arg;
    return new CmsConnector(publicEnv);
  }
  constructor(protected readonly publicEnv: PublicEnv) {}
  async json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let info: RequestInfo;
    if (typeof input === 'string') {
      info = `${this.publicEnv.CMS_URL}${input}`;
      Debug.CmsConnector(`[${this.json.name}] "${info}"`);
    } else {
      info = {
        ...input,
        url: `${this.publicEnv.CMS_URL}${input.url}`,
      };
      Debug.CmsConnector(`[${this.json.name}] "${info.url}"`);
    }
    const response = await fetch(info, init);
    const json: T = await response.json();
    if (!response.ok) throw json;
    return json;
  }
}
