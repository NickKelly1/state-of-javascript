import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PublicEnvSingleton, PublicEnv } from "../env/public-env.helper";
import { Sdk } from "../sdk/sdk";
import { SdkConnector } from "../sdk/sdk-connector";

interface ApiHandlerFn<T> {
  (arg: {
    req: NextApiRequest,
    res: NextApiResponse<T>,
    sdk: Sdk,
    publicEnv: PublicEnv,
  }): void | Promise<void>;
}

export function apiHandler<T = any>(handler: ApiHandlerFn<T>): NextApiHandler {
  return async function wrapper(req, res) {
    const sdkConnector = SdkConnector.create({ publicEnv: PublicEnvSingleton });
    const sdk = Sdk.create({ publicEnv: PublicEnvSingleton, sdkConnector });
    const result = await handler({ req, res, sdk, publicEnv: PublicEnvSingleton });
    return result;
  }
}