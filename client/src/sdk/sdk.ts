import { PublicEnv } from "../env/public-env.helper";
import { SdkConnector } from "./sdk-connector";
import { ResourceSdkResource } from "./types/resource.sdk.resource";
import { StorySdkResource } from "./types/story.sdk.resource";

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

  async resources(): Promise<ResourceSdkResource[]> {
    const resources = await this.sdkConnector.json<ResourceSdkResource[]>('/resources');
    return resources;
  }

  async stories(): Promise<StorySdkResource[]> {
    const stories = await this.sdkConnector.json<StorySdkResource[]>('/stories');
    return stories;
  }
}
