import { PublicEnv } from "../env/public-env.helper";

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
      console.log('hitting:', info);
    } else {
      info = {
        ...input,
        url: `${this.url}${input.url}`,
      };
      console.log('hitting:', info.url);
    }
    const response = await fetch(info, init);
    const json: T = await response.json();
    if (!response.ok) throw json;
    return json;
  }
}