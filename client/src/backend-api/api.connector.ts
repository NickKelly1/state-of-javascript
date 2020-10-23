import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { ApiCredentials } from "./api.credentials";
import { request } from "graphql-request";

export class ApiConnector {
  static create(arg: {
    publicEnv: PublicEnv;
    credentials: ApiCredentials;
  }): ApiConnector {
    const { publicEnv, credentials } = arg;
    return new ApiConnector(publicEnv, credentials);
  }


  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly credentials: ApiCredentials,
  ) {}


  /**
   * Send a json request
   * outdated
   *
   * @param input
   * @param init
   */
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


  /**
   * Send a GraphQL Request
   * Uses authentication
   *
   * @param document
   * @param variables
   */
  async graphql<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<T> {
    const doTry = () => request<T, V>('http://localhost:4000/v1/graphql', document, variables);
    try {
      await this.credentials.sync();
      const result = await doTry();
      return result;
    } catch(error) {
      const exception = error?.extensions?.exception;
      if (!exception) throw error;
      if (exception?.code !== 401) throw error;
      const { authenticated } = await this.credentials.forceSync();
      if (authenticated) {
        const result = await doTry();
        return result;
      }
      throw exception;
    }
  }
}
