import { BaseJob, IJobProcessArg } from "../../common/classes/base.job";
import { OrNull } from "../../common/types/or-null.type";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";


export interface IEmailJobData {
  to: OrNull<string | string[]>;
  cc: OrNull<string | string[]>;
  subject: OrNull<string>;
  text: OrNull<string>;
}


export class EmailJob extends BaseJob<IEmailJobData> {
  protected readonly options = {
    name: 'email',
    prefix: 'fixed',
    // 30 sec
    backoffDelay: 30_000,
    attempts: 2,
    delay: 5_000,
  }


  /**
   * @inheritdoc
   */
  async process(arg: IJobProcessArg<IEmailJobData>): Promise<void> {
    const { job, ctx, id, } = arg;
    const { data } = job;
    logger.info(`[${this.constructor.name}::process::${id}] Sending email... ${prettyQ(data)}`);
    await ctx.services.emailService.send({ dto: data, });
  }
}