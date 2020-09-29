import { PublicEnv } from "../env/public-env.helper";

export class SdkConnector {
  static create(arg: { publicEnv: PublicEnv; }): SdkConnector {
    const { publicEnv } = arg;
    return new SdkConnector(publicEnv);
  }
  constructor(protected readonly publicEnv: PublicEnv) {}
  async json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let info: RequestInfo;
    if (typeof input === 'string') {
      info = `${this.publicEnv.API_URL}${input}`;
    } else [
      info = {
        ...input,
        url: `${this.publicEnv.API_URL}${input.url}`,
      }
    ]
    const response = await fetch(info, init);
    const json: T = await response.json();
    return json;
  }
}
