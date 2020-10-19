import { GetServerSidePropsContext, GetServerSidePropsResult, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { PublicEnv, PublicEnvSingleton } from "../env/public-env.helper";
import { NpmsApi } from "../npms-api/npms-api";
import { NpmsApiConnector } from "../npms-api/npms-api-connector";
import { Cms } from "../cms/cms";
import { CmsConnector } from "../cms/cms-connector";
import { Debug } from "../debug/debug";
import { Api } from "../backend-api/api";
import { ApiFactory } from "../backend-api/api.factory";
import { NpmsApiFactory } from "../npms-api/npms-api.factory";
import { CmsFactory } from "../cms/cms.factory";

interface ServerSidePropsHander<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  (arg: {
    ctx: GetServerSidePropsContext<Q>,
    cms: Cms;
    api: Api;
    publicEnv: PublicEnv;
    npmsApi: NpmsApi;
  }): Promise<GetServerSidePropsResult<P>>;
}


export function serverSidePropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: ServerSidePropsHander<P, Q>
): GetServerSideProps<P, Q> {
  const wrapper: GetServerSideProps<P, Q> = async (ctx) => {
    const start = Date.now();
    const params = ctx.query ? new URLSearchParams(ctx.query as any) : undefined;
    Debug.ServerSideProps(`[${serverSidePropsHandler.name}] handling ${ctx.req.url}?${params?.toString() ?? ''}...`);
    ctx.res.on('finish', () => {
      const end = Date.now();
      const dur = end - start;
      console.log(`${ctx.req.url}?${params?.toString() ?? ''}\t${ctx.res.statusCode}\t+${dur}ms`)
    });
    const publicEnv = PublicEnvSingleton;
    const cms = CmsFactory({ publicEnv });
    const npmsApi = NpmsApiFactory({ publicEnv });
    const api = ApiFactory({ publicEnv });
    const result = await handler({ ctx, cms, publicEnv, npmsApi, api, });
    return result;
  }
  return wrapper;
}
