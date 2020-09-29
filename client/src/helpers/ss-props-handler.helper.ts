import { GetServerSidePropsContext, GetServerSidePropsResult, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { PublicEnv, PublicEnvSingleton } from "../env/public-env.helper";
import { Sdk } from "../sdk/sdk";
import { SdkConnector } from "../sdk/sdk-connector";

interface ServerSidePropsHander<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  (arg: {
    ctx: GetServerSidePropsContext<Q>,
    sdk: Sdk;
    publicEnv: PublicEnv;
  }): Promise<GetServerSidePropsResult<P>>;
}

/**
 * 
 * @param handler Server-side props handler
 */
export function ssPropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: ServerSidePropsHander<P, Q>
): GetServerSideProps<P, Q> {
  return async function wrapper(ctx: GetServerSidePropsContext<Q>) {
    const sdkConnector = SdkConnector.create({ publicEnv: PublicEnvSingleton });
    const sdk = Sdk.create({ publicEnv: PublicEnvSingleton, sdkConnector });
    const result = await handler({ ctx, sdk, publicEnv: PublicEnvSingleton });
    return result;
  }
}