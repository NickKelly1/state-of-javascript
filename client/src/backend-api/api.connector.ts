import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";

export class ApiConnector {
  static create(arg: { publicEnv: PublicEnv; }): ApiConnector {
    const { publicEnv } = arg;
    return new ApiConnector(publicEnv);
  }
  constructor(protected readonly publicEnv: PublicEnv) {}
  async json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let info: RequestInfo;
    if (typeof input === 'string') {
      info = `${this.publicEnv.API_URL}${input}`;
      Debug.BackendApiConnector(`[${this.json.name}] "${info}"`);
    } else {
      info = {
        ...input,
        url: `${this.publicEnv.API_URL}${input.url}`,
      };
      Debug.BackendApiConnector(`[${this.json.name}] "${info.url}"`);
    }
    const response = await fetch(info, init);
    const json: T = await response.json();
    if (!response.ok) throw json;
    return json;
  }
}
