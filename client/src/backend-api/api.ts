import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";
import { ApiConnector } from "./api.connector";
import { IApiServices } from "./api.services.interface";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { request } from "graphql-request";
import { ApiCredentials } from "./api.credentials";

export class Api {
  static create(arg: {
    publicEnv: PublicEnv;
    backendApiConnector: ApiConnector;
    services: IApiServices;
    credentials: ApiCredentials;
  }): Api {
    const {
      publicEnv,
      backendApiConnector,
      services,
      credentials,
    } = arg;

    return new Api(
      publicEnv,
      backendApiConnector,
      services,
      credentials,
    );
  }

  constructor(
    protected readonly publicEnv: PublicEnv,
    public readonly connector: ApiConnector,
    public readonly services: IApiServices,
    public readonly credentials: ApiCredentials,
  ) {
    //
  }
}
