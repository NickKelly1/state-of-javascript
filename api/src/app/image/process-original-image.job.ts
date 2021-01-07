import { BaseJob, IJobProcessArg } from "../../common/classes/base.job";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IImageServiceCreateOriginalDto } from "./image.service";
import { IProcessThumbnailImageJobData } from "./process-thumbnail-image.job";
import path from 'path';


export interface IProcessOriginalImageJobData {
  dto: IImageServiceCreateOriginalDto;
}


export class ProcessOriginalImageJob extends BaseJob<IProcessOriginalImageJobData> {
  /**
   * @inheritdoc
   */
  protected readonly options = {
    name: 'process-original-image',
    prefix: 'fixed',
    // 30 sec
    backoffDelay: 30_000,
    attempts: 2,
    delay: 5_000,
  }


  /**
   * @inheritdoc
   */
  async process(arg: IJobProcessArg<IProcessOriginalImageJobData>): Promise<void> {
    const { job, ctx, id, } = arg;
    const { data } = job;
    logger.info(`[${this.constructor.name}::process::${id}]... ${prettyQ(data)}`);
    const { file } = await ctx.services.imageService.createOriginal({ runner: null, dto: data.dto, });

    // enqueue thumbnail processing
    const thumbnailDto: IProcessThumbnailImageJobData = {
      dto: {
        encoding: data.dto.encoding,
        image_id: data.dto.image_id,
        original_file: path.join(ctx.services.universal.env.UPLOADS_DIR, `./${file.filename}`),
        uploader: data.dto.uploader,
      },
    };
    await ctx.services.universal.jobService.processThumbnailImage.enqueue(thumbnailDto);
  }
}
