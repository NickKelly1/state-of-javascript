import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from "../../common/logger/logger";
import { EmailJob } from '../email/email.job'
import { ProcessDisplayImageJob } from '../image/process-display-image.job';
import { ProcessOriginalImageJob, } from '../image/process-original-image.job';
import { ProcessThumbnailImageJob, } from '../image/process-thumbnail-image.job';


export class JobService {
  public readonly email: EmailJob;
  public readonly processOriginalImage: ProcessOriginalImageJob;
  public readonly processThumbnailImage: ProcessThumbnailImageJob;
  public readonly processDisplayImage: ProcessDisplayImageJob;

  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    this.email = new EmailJob(universal);
    this.processOriginalImage = new ProcessOriginalImageJob(universal);
    this.processThumbnailImage = new ProcessThumbnailImageJob(universal);
    this.processDisplayImage = new ProcessDisplayImageJob(universal);
    //
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}...`);
    this.email.init();
    this.processOriginalImage.init();
    this.processThumbnailImage.init();
    this.processDisplayImage.init();
    this._initialised = true;
  }
}
