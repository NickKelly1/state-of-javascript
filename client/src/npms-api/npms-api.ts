import { PublicEnv } from "../env/public-env.helper";
import { OrNullable } from "../types/or-nullable.type";
import { NpmsApiConnector } from "./npms-api-connector";
import { NpmsPackageInfo, NpmsPackageInfos } from "./types/npms-package-info.type";
import { Debug } from "../debug/debug";

/**
 * https://api-docs.npms.io/#api-_Package
 */
export class NpmsApi {
  protected readonly version = '2';

  static create(arg: { publicEnv: PublicEnv; npmsApiConnector: NpmsApiConnector }): NpmsApi {
    const { publicEnv, npmsApiConnector } = arg;
    return new NpmsApi(publicEnv, npmsApiConnector);
  }

  protected constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly connector: NpmsApiConnector,
  ) {}

  async packageInfo(arg: { name: string }): Promise<NpmsPackageInfo> {
    const { name } = arg;
    const url = `/v${this.version}/package/${name}`
    Debug.Npms(`[${this.packageInfo.name}] package info: "${name}"`);
    const json = this.connector.json<NpmsPackageInfo>(
      url,
      {
        headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    return json;
  }

  async packageInfos<T extends string>(arg: { names: T[] | readonly T[] }): Promise<NpmsPackageInfos<T>> {
    const { names } = arg;
    const body = JSON.stringify({ names });
    Debug.Npms(`[${this.packageInfos.name}] package info: "${names.join(', ')}"`);
    const json = this.connector.json<Record<string, OrNullable<NpmsPackageInfo>>>(
      `/v${this.version}/package/mget`,
      {
        method: 'POST',
        body: JSON.stringify(names),
        headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      },
    );
    return json;
  }
}

