import { EnvService } from "../../../common/environment/env";
import { NpmsApi } from "./npms-api";
import { NpmsApiConnector } from "./npms-api-connector";

export function npmsApiFactory(arg: { env: EnvService }): NpmsApi {
  const { env } = arg;
  const connector = new NpmsApiConnector(env);
  const npmsApi = new NpmsApi(env, connector);
  return npmsApi;
}