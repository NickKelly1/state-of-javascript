import { PublicEnv } from "../env/public-env.helper";
import { Api } from "./api";
import { ApiConnector } from "./api.connector";
import { ApiCredentials } from "./api.credentials";

export function ApiFactory(arg: { publicEnv: PublicEnv }): Api {
  const { publicEnv } = arg;
  const credentials = new ApiCredentials(publicEnv);
  const apiConnector = new ApiConnector(publicEnv, credentials);
  const api = new Api(publicEnv, apiConnector, credentials);
  return api;
}