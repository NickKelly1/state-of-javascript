import { PublicEnv } from "../env/public-env.helper";
import { SdkConnector } from "./sdk-connector";
import { SdkQuery } from "./sdk-query.type";
import { ResourceSdkResource } from "./types/resource.sdk.resource";
import { ArticleSdkResource } from "./types/article.sdk.resource";

export class Sdk {
  static create(arg: {
    publicEnv: PublicEnv;
    sdkConnector: SdkConnector;
  }): Sdk {
    const { publicEnv, sdkConnector } = arg;
    return new Sdk(publicEnv, sdkConnector);
  }

  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly sdkConnector: SdkConnector,
  ) {
    //
  }

  async resources(arg: { query?: SdkQuery }): Promise<ResourceSdkResource[]> {
    const { query } = arg;
    const search = query?.toSearch().toString() ?? '';
    const resources = await this.sdkConnector.json<ResourceSdkResource[]>(`/resources?${search}`);
    return resources;
  }

  async stories(arg: { query?: SdkQuery }): Promise<ArticleSdkResource[]> {
    const { query } = arg;
    const search = query?.toSearch().toString() ?? '';
    const stories = await this.sdkConnector.json<ArticleSdkResource[]>(`/stories?${search}`);
    return stories;
  }
}
