import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { ApiCredentials } from "./api.credentials";
import { GraphQLClient, request } from "graphql-request";
import { normaliseApiException } from "./normalise-api-exception.helper";
import { isoFetch } from "../iso-fetch";
import { GraphQLError } from "graphql";

let counter = 0;

export class ApiConnector {
  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly credentials: ApiCredentials,
  ) {
  }


  // /**
  //  * Send a json request
  //  * outdated
  //  *
  //  * @param input
  //  * @param init
  //  */
  // async json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  //   let info: RequestInfo;
  //   if (typeof input === 'string') {
  //     info = `${this.publicEnv.API_URL}${input}`;
  //     Debug.BackendApiConnector(`[${this.json.name}] "${info}"`);
  //   } else {
  //     info = {
  //       ...input,
  //       url: `${this.publicEnv.API_URL}${input.url}`,
  //     };
  //     Debug.BackendApiConnector(`[${this.json.name}] "${info.url}"`);
  //   }
  //   const response = await fetch(info, init);
  //   const json: T = await response.json();
  //   if (!response.ok) throw json;
  //   return json;
  // }


  /**
   * Make a GraphQL request using the current credentials
   *
   * If credentials have expired, refresh & retry
   * 
   * @param doc
   * @param vars
   */
  async graphql<T = any, V = Variables>(doc: RequestDocument, vars?: V): Promise<T> {
    const ident = counter += 1;
    Debug.ApiConnector(`[${ident}] graphql request...`);

    // get requester when credentials are settled
    const requester1 = await this.credentials.getSafeRequester();

    Debug.ApiConnector(`[${ident}] 1: credentialed: ${String(requester1.credentialed)}`);

    // requester isn't credentialed - just send raw request
    if (!requester1.credentialed) return requester1.client.request<T, V>(doc, vars);

    // send inside credentialed wrapping

    // 1: case 200 - success
    try {
      // 1: try
      Debug.ApiConnector(`[${ident}] 1: try...`);
      const result1 = await requester1.client.request<T, V>(doc, vars);
      // 1: success
      Debug.ApiConnector(`[${ident}] 1: success...`);
      return result1;
    } catch (error1) {
      // 1: fail
      // GraphQLError is thrown with a .request and .response
      const exception1 = normaliseApiException(error1.response);
      Debug.ApiConnector(`[${ident}] 1: fail...`);

      // 2: case 440 - login hard expired - logout
      if (exception1.code === 440) {
        Debug.ApiConnector(`[${ident}] 2: handling 440`);
        // 2: logout
        await this.credentials.logout();
        // 2: rethrow
        throw exception1;
      }

      // 3: case 401 - unauthenticated - logout
      if (exception1.code === 401) {
        Debug.ApiConnector(`[${ident}] 3: handling 401`);
        // access expired - refresh & retry

        // 3: if not authenticating already, refresh
        if (!this.credentials.isRunning()) {
          Debug.ApiConnector(`[${ident}] 3: refreshing credentials`);
          await this.credentials.refresh();
        } else {
          Debug.ApiConnector(`[${ident}] 3: not refreshing`);
        }

        // 3: get new requester
        const requester3 = await this.credentials.getSafeRequester();//.client.request<T, V>(doc, vars);

        Debug.ApiConnector(`[${ident}] 3: credentialed: ${String(requester3.credentialed)}`);

        // 3: no longer credentialed? just throw
        if (!requester3.credentialed) throw exception1;

        Debug.ApiConnector(`[${ident}] 3: Re-requesting...`);

        // 4: redo the initial request with new credentials
        const result3 = await requester3.client.request<T, V>(doc, vars);

        // 4: success
        return result3;
      }

      // 4: case 4|5xx
      // just re-throw
      Debug.ApiConnector(`[${ident}] 4: Re-throwing...`);
      throw exception1;
    }
  }
}
