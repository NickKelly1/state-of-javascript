import { BaseJob, IJobProcessArg } from "../../common/classes/base.job";
import { OrNull } from "../../common/types/or-null.type";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IImageServiceCreateThumbnailDto } from "./image.service";
import path from 'path';
import { IProcessDisplayImageJobData } from "./process-display-image.job";


export interface IProcessThumbnailImageJobData {
  dto: IImageServiceCreateThumbnailDto;
}


export class ProcessThumbnailImageJob extends BaseJob<IProcessThumbnailImageJobData> {
  /**
   * @inheritdoc
   */
  protected readonly options = {
    name: 'process-thumbnail-image',
    prefix: 'fixed',
    // 30 sec
    backoffDelay: 30_000,
    attempts: 2,
    delay: 5_000,
  }


  /**
   * @inheritdoc
   */
  async process(arg: IJobProcessArg<IProcessThumbnailImageJobData>): Promise<void> {
    const { job, ctx, id, } = arg;
    const { data } = job;
    logger.info(`[${this.constructor.name}::process::${id}]... ${prettyQ(data)}`);
    await ctx.services.imageService.createThumbnail({ runner: null, dto: data.dto, });

    // enqueue display processing
    const displayDto: IProcessDisplayImageJobData = {
      dto: {
        encoding: data.dto.encoding,
        image_id: data.dto.image_id,
        original_file: data.dto.original_file,
        uploader: data.dto.uploader,
      },
    };
    await ctx.services.universal.jobService.processDisplayImage.enqueue(displayDto);
  }
}
