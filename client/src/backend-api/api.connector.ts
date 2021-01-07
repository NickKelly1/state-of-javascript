import { PublicEnv } from "../env/public-env.helper";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { ApiCredentials, IHttpClientWrapper } from "./api.credentials";
import { normaliseApiException } from "./normalise-api-exception.helper";
import { IApiHttpClientRequestOptions } from "./api.http.client";

let counter = 0;

export class ApiConnector {
  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly credentials: ApiCredentials,
  ) {
    //
  }


  /**
   * Make an Http request using the current credentials
   *
   * If credentials have expired, refresh & retry
   * 
   * @param doc
   * @param vars
   */
  async http(path: string, options: IApiHttpClientRequestOptions): Promise<Response> {
    return this._send(async ({ http }) => {
      const result = await http.request(path, options);
      if (!result.ok){ 
        const error = await result.json();
        throw error;
      }
      return result;
    });
  }


  /**
   * Make a GraphQL request using the current credentials
   *
   * If credentials have expired, refresh & retry
   * 
   * @param doc
   * @param vars
   */
  async graphql<T = unknown, V = Variables>(doc: RequestDocument, vars?: V): Promise<T> {
    return this._send(({ graphql }) => graphql.request(doc, vars));
  }


  /**
   * Send a request using the current authentication context...
   */
  async _send<T>(requestFn: (wrapper: IHttpClientWrapper) => Promise<T>): Promise<T> {
    const ident = counter += 1;
    console.log(`[ApiConnector::graphql] [${ident}] graphql request...`);

    // get requester when credentials are settled
    const requester1 = await this.credentials.getSafeRequester();

    console.log(`[ApiConnector::graphql] [${ident}] 1: credentialed: ${String(requester1.credentialed)}`);

    // requester isn't credentialed - just send raw request
    if (!requester1.credentialed) return requestFn(requester1);

    // send inside credentialed wrapping

    // 1: case 200 - success
    try {
      // 1: try
      console.log(`[ApiConnector::graphql] [${ident}] 1: try...`);
      const result1 = await requestFn(requester1);
      // 1: success
      console.log(`[ApiConnector::graphql] [${ident}] 1: success...`);
      return result1;
    } catch (error1) {
      // 1: fail
      // GraphQLError is thrown with a .request and .response
      const exception1 = normaliseApiException(error1);
      console.log(`[ApiConnector::graphql] [${ident}] 1: fail...`);

      // 2: case 440 - login hard expired - logout
      if (exception1.code === 440) {
        console.log(`[ApiConnector::graphql] [${ident}] 2: handling 440`);
        // 2: logout
        await this.credentials.logout();
        // 2: rethrow
        throw exception1;
      }

      // 3: case 401 - unauthenticated - logout
      if (exception1.code === 401) {
        console.log(`[ApiConnector::graphql] [${ident}] 3: handling 401`);
        // access expired - refresh & retry

        // 3: if not authenticating already, refresh
        if (!this.credentials.isRunning()) {
          console.log(`[ApiConnector::graphql] [${ident}] 3: refreshing credentials`);
          await this.credentials.refresh();
        } else {
          console.log(`[ApiConnector::graphql] [${ident}] 3: not refreshing`);
        }

        // 3: get new requester
        const requester3 = await this.credentials.getSafeRequester();//.client.request<T, V>(doc, vars);

        console.log(`[ApiConnector::graphql] [${ident}] 3: credentialed: ${String(requester3.credentialed)}`);

        // 3: no longer credentialed? just throw
        if (!requester3.credentialed) throw exception1;

        console.log(`[ApiConnector::graphql] [${ident}] 3: Re-requesting...`);

        // 4: redo the initial request with new credentials
        const result3 = await requestFn(requester3);

        // 4: success
        return result3;
      }

      // 4: case 4|5xx
      // just re-throw
      console.log(`[ApiConnector::graphql] [${ident}] 4: Re-throwing...`);
      throw exception1;
    }
  }
}
