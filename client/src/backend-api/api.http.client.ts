import { PublicEnvSingleton } from "../env/public-env.helper";
import { isoFetch } from "../iso-fetch";
import { IApiMe } from "./api.me";

export interface IApiHttpClientRequestOptions {
  headers?: [string, string][];
  body?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

// export interface IApiHttpClient {
//   request(path: string, options?: IApiHttpClientRequestOptions): Promise<Response>;
// }

export class ApiHttpClient {
  protected readonly alwaysHeaders: [string, string][] = [];
  protected readonly url: string = PublicEnvSingleton.API_URL;
  protected optionalHeaders: [string, string][] = [];

  constructor(
    protected readonly me: IApiMe,
    protected credentialed: boolean,
  ) {
    //
  }

  /**
   * Set the optional headers for the client
   */
  setHeaders(next: [string, string][]): void {
    this.optionalHeaders = next;
  }

  /**
   * Set whether the client is credentialed or not...
   */
  setCredentialed(to: boolean): void {
    this.credentialed = to;
  }

  /**
   * Make a Http Request
   */
  async request(path: string, options?: IApiHttpClientRequestOptions): Promise<Response> {
    let uri = this.url;
    if (uri.endsWith('/')) {
      if (path.startsWith('/')) {
        // double slash
        uri += path.substr(1);
      }
      else {
        // single slash
        uri += path;
      }
    } else {
      // single slash
      if (path.startsWith('/')) {
        uri += path;
      }
      // no slash
      else {
        uri += `/${path}`;
      }
    }
    const headers = [
      ...this.alwaysHeaders,
      ...this.optionalHeaders,
      ...(options?.headers ?? []),
    ];
    const init: RequestInit = {
      method: options?.method ?? 'GET',
      headers,
      body: options?.body,
      credentials: this.credentialed ? 'include' : 'omit',
      mode: 'cors',
    };
    const result = await isoFetch(uri, init);
    return result;
  }
}
