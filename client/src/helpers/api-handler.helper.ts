import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PublicEnvSingleton, PublicEnv } from "../env/public-env.helper";
import { NpmsApi } from "../npms-api/npms-api";
import { NpmsApiConnector } from "../npms-api/npms-api-connector";
import { Cms } from "../cms/cms";
import { CmsConnector } from "../cms/cms-connector";

interface ApiHandlerFn<T> {
  (arg: {
    req: NextApiRequest;
    res: NextApiResponse<T>;
    cms: Cms;
    npmsApi: NpmsApi;
    publicEnv: PublicEnv;
  }): void | Promise<void>;
}

export function apiHandler<T = any>(handler: ApiHandlerFn<T>): NextApiHandler {
  return async function wrapper(req, res) {
    const publicEnv = PublicEnvSingleton;

    const cmsConnector = CmsConnector.create({ publicEnv });
    const cms = Cms.create({ publicEnv, cmsConnector });

    const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
    const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });

    const result = await handler({
      req,
      res,
      cms,
      publicEnv,
      npmsApi,
    });

    return result;
  }
}