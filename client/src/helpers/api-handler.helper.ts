import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PublicEnvSingleton, PublicEnv } from "../env/public-env.helper";
import { NpmsApi } from "../npms-api/npms-api";
import { NpmsApiConnector } from "../npms-api/npms-api-connector";
import { Sdk } from "../sdk/sdk";
import { SdkConnector } from "../sdk/sdk-connector";

interface ApiHandlerFn<T> {
  (arg: {
    req: NextApiRequest;
    res: NextApiResponse<T>;
    sdk: Sdk;
    npmsApi: NpmsApi;
    publicEnv: PublicEnv;
  }): void | Promise<void>;
}

export function apiHandler<T = any>(handler: ApiHandlerFn<T>): NextApiHandler {
  return async function wrapper(req, res) {
    const publicEnv = PublicEnvSingleton;

    const sdkConnector = SdkConnector.create({ publicEnv });
    const sdk = Sdk.create({ publicEnv, sdkConnector });

    const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
    const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });

    const result = await handler({
      req,
      res,
      sdk,
      publicEnv,
      npmsApi,
    });

    return result;
  }
}