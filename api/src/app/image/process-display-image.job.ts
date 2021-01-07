import { BaseJob, IJobProcessArg } from "../../common/classes/base.job";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IImageServiceCreateDisplayDto } from "./image.service";


export interface IProcessDisplayImageJobData {
  dto: IImageServiceCreateDisplayDto;
}


export class ProcessDisplayImageJob extends BaseJob<IProcessDisplayImageJobData> {
  /**
   * @inheritdoc
   */
  protected readonly options = {
    name: 'process-display_image',
    prefix: 'fixed',
    // 30 sec
    backoffDelay: 30_000,
    attempts: 2,
    delay: 5_000,
  }


  /**
   * @inheritdoc
   */
  async process(arg: IJobProcessArg<IProcessDisplayImageJobData>): Promise<void> {
    const { job, ctx, id, } = arg;
    const { data } = job;
    logger.info(`[${this.constructor.name}::process::${id}]... ${prettyQ(data)}`);
    await ctx.services.imageService.createDisplay({ runner: null, dto: data.dto, });
  }
}
