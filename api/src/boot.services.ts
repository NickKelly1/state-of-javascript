// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as overrides from './custom';
import * as cron from 'cron';
import { EnvService } from './common/environment/env';
import { createSequelize, } from './app/db/create-sequelize';
import { logger, } from './common/logger/logger';
import { initialiseDb } from './initialise-db';
import { prettyQ } from './common/helpers/pretty.helper';
import { IGoogleIntegrationServiceSendEmailDto } from './app/google/dtos/google.service.send-email-dto';
import { Integration } from './app/integration/integration.const';
import { JobRunnerFactory } from './common/helpers/jb.helper';
import { CronTickHandlerFactory, ICronTickHandlerFnArg } from './common/helpers/cron-tick-handler.helper';
import { UniversalSerivceContainer } from './common/containers/universal.service.container';
import { IUniversalServices } from './common/interfaces/universal.services.interface';

/**
 * Boot the application
 */
export async function bootServices(arg: { env: EnvService, }): Promise<IUniversalServices> {
  const { env } = arg;
  logger.info(`[bootApp] Booting...`);
  const sequelize = createSequelize({ env });
  await initialiseDb({ sequelize, env });
  const universal = new UniversalSerivceContainer(env, sequelize);
  await universal.init();

  /**
   * Emails
   * 
   * TODO: put this elsewhere...
   */
  const jr = JobRunnerFactory(universal);
  universal.queueService.email.process(jr(async ({ ctx, job }) => {
    logger.info(`Processing email:\n${prettyQ(job.data)}`);
    await ctx.services.universal.db.transact(async ({ runner }) => {
      const serviceDto: IGoogleIntegrationServiceSendEmailDto = {
        to: job.data.to,
        body: job.data.body,
        subject: job.data.subject,
        cc: job.data.cc,
      };
      const model = await ctx
        .services
        .integrationRepository
        .findByPkOrfail(Integration.Google, { runner, });
      await ctx.services.googleService.sendEmail({
        runner,
        dto: serviceDto,
        model,
      });
    });
  }));


  /**
   * Cron
   * 
   * TODO: put this elsewhere...
   */
  if (env.MASTER) {
    const onTick = CronTickHandlerFactory(universal);
    const job = new cron.CronJob(
      '* * * * *',
      onTick(async ({ ctx }: ICronTickHandlerFnArg) => {
        logger.info('Updating old npms packages...');
        ctx.services.universal.db.transact(async ({ runner }) => {
          // find all that haven't been checked in the last day...
          const yesterday = new Date(Date.now() - 1_000 * 60 * 60 * 24);
          // const threeMinutesAgo = new Date(Date.now() - 1_000 * 60 * 3);
          await ctx.services.npmsPackageService.synchronise({
            runner,
            since: yesterday,
          });
        });
      }),
      function onComplete() {
        //
      },
      true,
      'UTC',
    );
    job.start();
  }


  return universal;
}