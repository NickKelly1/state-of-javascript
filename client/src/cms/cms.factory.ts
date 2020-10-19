
import { PublicEnv } from "../env/public-env.helper";
import { Cms } from './cms';
import { CmsConnector } from './cms-connector';

export function CmsFactory(arg: { publicEnv: PublicEnv }): Cms {
  const { publicEnv } = arg;
  const cmsConnector = CmsConnector.create({ publicEnv });
  const cms = Cms.create({ publicEnv, cmsConnector });
  return cms;
}