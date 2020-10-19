import { PublicEnv } from "../env/public-env.helper";
import { Debug } from "../debug/debug";
import { ApiConnector } from "./api.connector";
import { IApiServices } from "./api.services.interface";

export class Api {
  static create(arg: {
    publicEnv: PublicEnv;
    backendApiConnector: ApiConnector;
    services: IApiServices;
  }): Api {
    const {
      publicEnv,
      backendApiConnector,
      services,
    } = arg;
    return new Api(
      publicEnv,
      backendApiConnector,
      services,
    );
  }

  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly backendApiConnector: ApiConnector,
    public readonly services: IApiServices,
  ) {
    //
  }


  // async resources(arg: { query?: CmsQuery }): Promise<ResourceCmsResource[]> {
  //   const { query } = arg;
  //   const search = query?.toSearch().toString() ?? '';
  //   Debug.Cms(`[${this.resources.name}] Finding resources: "${search}"`);
  //   const resources = await this.backendApiConnector.json<ResourceCmsResource[]>(`/resources?${search}`);
  //   return resources;
  // }

  // async stories(arg: { query?: CmsQuery }): Promise<ArticleCmsResource[]> {
  //   const { query } = arg;
  //   const search = query?.toSearch().toString() ?? '';
  //   Debug.Cms(`[${this.stories.name}] Finding stories: "${search}"`);
  //   const stories = await this.backendApiConnector.json<ArticleCmsResource[]>(`/stories?${search}`);
  //   return stories;
  // }
}
