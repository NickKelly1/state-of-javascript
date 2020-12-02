import { EnvService } from "../../../common/environment/env";
import { logger } from "../../../common/logger/logger";
import { prettyQ } from "../../../common/helpers/pretty.helper";
import { Request, RequestInfo, RequestInit } from "node-fetch";
import { nodeFetch } from "../../../common/polyfill/node-fetch.polyfill";
import { Str } from "../../../common/helpers/str.helper";

export class NpmsApiConnector {
  protected readonly _url = 'https://api.npms.io';

  constructor(protected readonly env: EnvService) {}

  /**
   * Start the url with https://api.npms.io/
   *
   * @param end
   */
  public url(end: string): string {
    Str.startWith({
      haystack: Str.startWith({
        needle: end,
        haystack: '/',
      }),
      needle: this._url
    });
    return `${this._url}${end}`;
  }

  async json<T>(url: string, init?: RequestInit): Promise<T> {
    const info = new Request(this.url(url), init);
    logger.debug(`npms-connector::json "${prettyQ(info.url)}"`);
    // TODO: verify this works...
    const response = await nodeFetch(info);
    const json: T = await response
      .json()
      .catch(error => {
        logger.error(`npms-connector::json [error]: "${prettyQ(error)}"`);
        throw error;
      });
    if (!response.ok) {
      logger.error(`npms-connector::json [fail ${response.status}]: "${prettyQ(json)}"`);
      throw json;
    }
    return json;
  }
}