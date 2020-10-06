import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext
} from "next";
import { ParsedUrlQuery } from "querystring";
import { PublicEnv, PublicEnvSingleton } from "../env/public-env.helper";
import { NpmsApi } from "../npms-api/npms-api";
import { NpmsApiConnector } from "../npms-api/npms-api-connector";
import { Sdk } from "../sdk/sdk";
import { SdkConnector } from "../sdk/sdk-connector";
import { Debug } from "../debug/debug";

interface StaticPropsHander<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  (arg: {
    ctx: GetStaticPropsContext<Q>,
    sdk: Sdk;
    publicEnv: PublicEnv;
    npmsApi: NpmsApi;
  }): Promise<GetStaticPropsResult<P>>;
}

interface StaticPathsHandler<P extends { [key: string]: any }> {
  (arg: {
    sdk: Sdk;
    publicEnv: PublicEnv;
    npmsApi: NpmsApi;
  }): Promise<GetStaticPathsResult<P>>;
}


export function staticPropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: StaticPropsHander<P, Q>
): GetStaticProps<P, Q> {
  const wrapper: GetStaticProps<P, Q> = async (ctx) => {
    const start = Date.now();
    const params = ctx.params ? new URLSearchParams(ctx.params as any) : undefined;
    Debug.StaticGeneration(`[${staticPropsHandler.name}] handling ${params?.toString() ?? '?'}...`);
    const publicEnv = PublicEnvSingleton;
    const sdkConnector = SdkConnector.create({ publicEnv });
    const sdk = Sdk.create({ publicEnv, sdkConnector });
    const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
    const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });
    const result = await handler({ ctx, npmsApi, publicEnv, sdk, });
    const end = Date.now();
    const dur = end - start;
    console.log(`static page -\t${params?.toString() ?? '?'}\t${dur}ms`)
    return result;
  }
  return wrapper;
}

export function staticPathsHandler<
  P extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: StaticPathsHandler<P>,
): GetStaticPaths<P> {
  const wrapper: GetStaticPaths<P> = async () => {
    const start = Date.now();
    Debug.StaticGeneration(`[${staticPathsHandler.name}] handling...`);
    const publicEnv = PublicEnvSingleton;
    const sdkConnector = SdkConnector.create({ publicEnv });
    const sdk = Sdk.create({ publicEnv, sdkConnector });
    const npmsApiConnector = NpmsApiConnector.create({ publicEnv });
    const npmsApi = NpmsApi.create({ publicEnv, npmsApiConnector });
    const result = await handler({ npmsApi, publicEnv, sdk, });
    const end = Date.now();
    const dur = end - start;
    console.log(`static paths -\t${dur}ms`)
    return result;
  }
  return wrapper;
}
