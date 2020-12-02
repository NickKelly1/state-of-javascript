import { Request } from "node-fetch";
import { EnvService } from "../../../common/environment/env";
import { logger } from "../../../common/logger/logger";
import { OrNullable } from "../../../common/types/or-nullable.type";
import { NpmsApiConnector } from "./npms-api-connector";
import { NpmsPackageInfo, NpmsPackageInfos } from "./npms-api.package-info.type";

/**
 * https://api-docs.npms.io/#api-_Package
 */
export class NpmsApi {
  protected readonly version = '2';

  constructor(
    protected readonly env: EnvService,
    protected readonly connector: NpmsApiConnector,
  ) {}

  /**
   * Get info of a package
   *
   * @param arg
   */
  async packageInfo(arg: { name: string }): Promise<NpmsPackageInfo> {
    const { name } = arg;
    const url = `/v${this.version}/package/${name}`
    logger.debug(`npms-api::package-info: "${name}"`);
    const json = this.connector.json<NpmsPackageInfo>(
      url,
      {
        method: 'GET',
        headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    return json;
  }

  /**
   * Get info of many packages
   *
   * @param arg
   */
  async packageInfos<T extends string>(arg: { names: T[] | readonly T[] }): Promise<NpmsPackageInfos<T>> {
    const { names } = arg;
    const body = JSON.stringify({ names });
    const url = `/v${this.version}/package/mget`;
    logger.debug(`npms-api::package-infos: "${names.join('", "')}"`);
    // const request = new Request(this.connector.url(url), { })
    const json = this.connector.json<Record<string, OrNullable<NpmsPackageInfo>>>(
      url,
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

