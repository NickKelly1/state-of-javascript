import { GetServerSidePropsContext, GetServerSidePropsResult, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { PublicEnv, PublicEnvSingleton } from "../env/public-env.helper";
import { NpmsApi } from "../npms-api/npms-api";
import { NpmsApiConnector } from "../npms-api/npms-api-connector";
import { Sdk } from "../sdk/sdk";
import { SdkConnector } from "../sdk/sdk-connector";

interface ServerSidePropsHander<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  (arg: {
    ctx: GetServerSidePropsContext<Q>,
    sdk: Sdk;
    publicEnv: PublicEnv;
    npmsApi: NpmsApi;
  }): Promise<GetServerSidePropsResult<P>>;
}

/**
 * @param handler Server-side props handler
 */
export function ssPropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: ServerSidePropsHander<P, Q>
): GetServerSideProps<P, Q> {
  return async function wrapper(ctx: GetServerSidePropsContext<Q>) {
    const publicEnv = PublicEnvSingleton;

    const sdkConnector = SdkConnector.create({ publicEnv });
    const sdk = Sdk.create({ publicEnv, sdkConnector });

    const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
    const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });

    const result = await handler({
      ctx,
      sdk,
      publicEnv,
      npmsApi,
    });

    return result;
  }
}