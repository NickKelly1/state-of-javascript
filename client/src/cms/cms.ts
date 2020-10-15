import { PublicEnv } from "../env/public-env.helper";
import { CmsConnector } from "./cms-connector";
import { CmsQuery } from "./cms-query.type";
import { ResourceCmsResource } from "./types/resource.cms.resource";
import { ArticleCmsResource } from "./types/article.cms.resource";
import { Debug } from "../debug/debug";

export class Cms {
  static create(arg: {
    publicEnv: PublicEnv;
    cmsConnector: CmsConnector;
  }): Cms {
    const { publicEnv, cmsConnector} = arg;
    return new Cms(publicEnv, cmsConnector);
  }

  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly cmsConnector: CmsConnector,
  ) {
    //
  }

  async resources(arg: { query?: CmsQuery }): Promise<ResourceCmsResource[]> {
    const { query } = arg;
    const search = query?.toSearch().toString() ?? '';
    Debug.Cms(`[${this.resources.name}] Finding resources: "${search}"`);
    const resources = await this.cmsConnector.json<ResourceCmsResource[]>(`/resources?${search}`);
    return resources;
  }

  async stories(arg: { query?: CmsQuery }): Promise<ArticleCmsResource[]> {
    const { query } = arg;
    const search = query?.toSearch().toString() ?? '';
    Debug.Cms(`[${this.stories.name}] Finding stories: "${search}"`);
    const stories = await this.cmsConnector.json<ArticleCmsResource[]>(`/stories?${search}`);
    return stories;
  }
}
