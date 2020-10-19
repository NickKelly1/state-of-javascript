
import { PublicEnv } from "../env/public-env.helper";
import { NpmsApi } from "./npms-api";
import { NpmsApiConnector } from "./npms-api-connector";

export function NpmsApiFactory(arg: { publicEnv: PublicEnv }): NpmsApi {
  const { publicEnv } = arg;
  const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
  const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });
  return npmsApi;
}