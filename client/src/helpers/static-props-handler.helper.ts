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
import { Cms } from "../cms/cms";
import { CmsConnector } from "../cms/cms-connector";
import { Debug } from "../debug/debug";
import { Api } from "../backend-api/api";
import { ApiFactory, ApiFactoryArgType } from "../backend-api/api.factory";
import { CmsFactory } from "../cms/cms.factory";
import { NpmsApiFactory } from "../npms-api/npms-api.factory";
import { IPageProps } from "../types/page-props.interface";

interface StaticPropsHander<P extends { [key: string]: any }, Q extends ParsedUrlQuery> {
  (arg: {
    ctx: GetStaticPropsContext<Q>,
    cms: Cms;
    api: Api;
    publicEnv: PublicEnv;
    npmsApi: NpmsApi;
  }): Promise<GetStaticPropsResult<P>>;
}

interface StaticPathsHandler<P extends { [key: string]: any }> {
  (arg: {
    cms: Cms;
    publicEnv: PublicEnv;
    api: Api;
    npmsApi: NpmsApi;
  }): Promise<GetStaticPathsResult<P>>;
}


export function staticPropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: StaticPropsHander<P, Q>
): GetStaticProps<IPageProps & P, Q> {
  const wrapper: GetStaticProps<IPageProps & P, Q> = async (ctx) => {
    const start = Date.now();
    const params = ctx.params ? new URLSearchParams(ctx.params as any) : undefined;
    Debug.StaticGeneration(`[${staticPropsHandler.name}] handling ${params?.toString() ?? '?'}...`);
    const publicEnv = PublicEnvSingleton;
    const cms = CmsFactory({ publicEnv });
    const npmsApi = NpmsApiFactory({ publicEnv });
    const api = await ApiFactory({ publicEnv, type: ApiFactoryArgType.WithoutCredentials, me: undefined, });
    const result = await handler({ ctx, npmsApi, publicEnv, cms, api, });
    const end = Date.now();
    const dur = end - start;
    Debug.StaticGeneration(`[${staticPropsHandler.name}] static page -\t${params?.toString() ?? '?'}\t${dur}ms`)
    const _me = await api.safeMe();
    return {
      ...result,
      props: {
        ...result.props,
        _me: _me.serialize(),
      } };
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
    const cms = CmsFactory({ publicEnv });
    const npmsApi = NpmsApiFactory({ publicEnv });
    const api = await ApiFactory({ publicEnv, type: ApiFactoryArgType.WithoutCredentials, me: undefined, });
    const result = await handler({ npmsApi, publicEnv, cms, api, });
    const end = Date.now();
    const dur = end - start;
    Debug.StaticGeneration(`[${staticPathsHandler.name}] static paths -\t${dur}ms`)
    return result;
  }
  return wrapper;
}
