import { PublicEnv } from "../env/public-env.helper";
import { ApiConnector } from "./api.connector";
import { ApiCredentials } from "./api.credentials";

export class Api {
  static create(arg: {
    publicEnv: PublicEnv;
    backendApiConnector: ApiConnector;
    credentials: ApiCredentials;
  }): Api {
    const {
      publicEnv,
      backendApiConnector,
      credentials,
    } = arg;

    return new Api(
      publicEnv,
      backendApiConnector,
      credentials,
    );
  }

  constructor(
    protected readonly publicEnv: PublicEnv,
    public readonly connector: ApiConnector,
    public readonly credentials: ApiCredentials,
  ) {
    //
  }
}
