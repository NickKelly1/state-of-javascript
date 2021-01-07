import sharp from 'sharp';
import tempy from 'tempy';
import { ImageModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { IWhoami } from '../../common/interfaces/whoami.interface';
import { QueryRunner } from '../db/query-runner';
import { logger } from '../../common/logger/logger';
import { FileModel } from '../file/file.model';
import { ImageId } from './image.id.type';
import { filenameify, randomFileName } from '../../common/helpers/filenameify.helper';
import { IProcessOriginalImageJobData } from './process-original-image.job';

export interface IImageServiceCreateImageDto {
  in_file: string;
  is_public: boolean;
  mimetype: string;
  encoding: string;
  extension: string;
  title: string;
  mv: boolean;
  uploader: IWhoami;
}

export interface IImageServiceCreateThumbnailDto {
  image_id: ImageId;
  original_file: string;
  encoding: string;
  uploader: IWhoami;
}

export interface IImageServiceCreateDisplayDto {
  image_id: ImageId;
  original_file: string;
  encoding: string;
  uploader: IWhoami;
}

export interface IImageServiceCreateOriginalDto {
  image_id: ImageId;
  in_file: string;
  encoding: string;
  mimetype: string;
  extension: string;
  uploader: IWhoami;
}

export class ImageService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Create a thumbnail for the image
   */
  async createThumbnail(arg: {
    runner: null,
    dto: IImageServiceCreateThumbnailDto,
  }): Promise<FileModel> {
    const { runner, dto, } = arg;
    const { uploader, encoding, image_id, original_file, } = dto;
    const log = (str: string) => logger.info(`[${this.constructor.name}:${this.createThumbnail.name}::${image_id}] ${str}`);

    // find image model...
    log(`Finding image...`);
    const image = await this
      .ctx
      .services
      .imageRepository
      .findByPkOrfail(image_id, { runner: null, });


    // write file
    log(`Creating "thumbnail" image...`);
    const out_file = tempy.file({ extension: 'jpeg' })
    await sharp(original_file)
      // cover preserves aspect ratio
      // crops to fit
      .resize({ width: 256, height: 256, fit: 'cover', })
      .toFormat('jpeg')
      .toFile(out_file);
    const mimetype = 'image/jpeg';


    // create the file model
    log('Creating "file" record...');
    const out_filename = filenameify({
      prefix: 'img_',
      name: image.fsid,
      suffix: '_thumbnail',
      extension: 'jpeg',
    });
    const file = await this.ctx.services.fileService.untransactedCreate({
      runner: null,
      dto: {
        encoding,
        in_file: out_file,
        is_public: false,
        mimetype,
        mv: true,
        out_filename,
        title: `${image.title}_thumbnail`,
        uploader,
      },
    });

    // update the image model
    log('Updating "image" record...');
    await image.reload({ transaction: undefined });
    image.thumbnail_id = file.id;
    await image.save({ transaction: undefined });

    return file;
  }


  /**
   * Create a display file for the image
   */
  async createDisplay(arg: {
    runner: null,
    dto: IImageServiceCreateDisplayDto,
  }): Promise<FileModel> {
    const { runner, dto, } = arg;
    const { uploader, encoding, image_id, original_file, } = dto;
    const log = (str: string) => logger.info(`[${this.constructor.name}:${this.createDisplay.name}::${image_id}] ${str}`);

    // find image model...
    log(`Finding image...`);
    const image = await this
      .ctx
      .services
      .imageRepository
      .findByPkOrfail(image_id, { runner: null, });


    // write file
    log(`Creating "display" image...`);
    const out_file = tempy.file({ extension: 'jpeg' })
    await sharp(original_file)
      // cover preserves aspect ratio
      // crops to fit
      .resize({ width: 1440, fit: 'cover', })
      .toFormat('jpeg')
      .toFile(out_file);
    const mimetype = 'image/jpeg';


    // create the file model
    log('Creating "file" record...');
    const out_filename = filenameify({
      prefix: 'img_',
      name: image.fsid,
      suffix: '_display',
      extension: 'jpeg',
    });
    const file = await this.ctx.services.fileService.untransactedCreate({
      runner: null,
      dto: {
        encoding,
        in_file: out_file,
        is_public: false,
        mimetype,
        mv: true,
        out_filename,
        title: `${image.title}_display`,
        uploader,
      },
    });

    // update the image model
    log('Updating "image" record...');
    await image.reload({ transaction: undefined });
    image.display_id = file.id;
    await image.save({ transaction: undefined });

    return file;
  }


  /**
   * Create an Original File for the image
   */
  async createOriginal(arg: {
    runner: null;
    dto: IImageServiceCreateOriginalDto;
  }): Promise<{ file: FileModel, image: ImageModel; }> {
    const { dto, } = arg;
    const { image_id, in_file, mimetype, encoding, extension, uploader, } = dto;

    const log = (str: string) => logger.info(`[${this.constructor.name}:${this.createOriginal.name}::${image_id}] ${str}`);

    // find image model...
    log(`Finding image...`);
    const image = await this
      .ctx
      .services
      .imageRepository
      .findByPkOrfail(image_id, { runner: null, });

    // create the file model
    log('Creating "file" record...');
    const out_filename = filenameify({
      prefix: 'img_',
      name: image.fsid,
      suffix: '_original',
      extension,
    });
    const file = await this.ctx.services.fileService.untransactedCreate({
      runner: null,
      dto: {
        encoding,
        mimetype,
        is_public: false,
        in_file,
        mv: true,
        out_filename,
        title: `${image.title}_original`,
        uploader,
      },
    });

    // re-load and update the image model since above operations
    // image may have changed in db, hence re-loading...
    log('Updating "image" record...');
    await image.reload({ transaction: undefined });
    image.original_id = file.id;
    await image.save({ transaction: undefined });

    return { file, image };
  }


  /**
   * Create an Image
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    dto: IImageServiceCreateImageDto,
  }): Promise<ImageModel> {
    const { runner, dto, } = arg;
    const { transaction } = runner;
    const { mv, encoding, is_public, mimetype, in_file, uploader, extension, title, } = dto;

    // retail the original file name
    const fsid = randomFileName();

    // create the naked image record
    const image = ImageModel.build({
      fsid,
      title,
      display_id: null,
      original_id: null,
      thumbnail_id: null,
    });

    // if transaction successful, enqueue processing of the original image...
    runner.afterCommit(async () => {
      logger.info(`Queueing image ${image.id} processing...`);
      // create a job to process the "original" image...
      const jobData: IProcessOriginalImageJobData = {
        dto: {
          encoding,
          in_file,
          mimetype,
          uploader,
          extension,
          image_id: image.id,
        }
      };
      this
        .ctx
        .services
        .universal
        .jobService
        .processOriginalImage
        .enqueue(jobData);
    });

    await image.save({ transaction });

    return image;
  }


  // /**
  //  * Update the Image
  //  *
  //  * @param arg
  //  */
  // async update(arg: {
  //   runner: QueryRunner;
  //   post: BlogPostModel;
  //   author: UserModel;
  //   model: ImageModel;
  //   dto: IImageServiceUpdateImageDto,
  // }): Promise<ImageModel> {
  //   const { runner, author, post, model, dto } = arg;
  //   const { transaction } = runner;
  //   if (ist.notUndefined(dto.body)) model.body = dto.body;
  //   if (ist.notUndefined(dto.hidden)) model.hidden = dto.hidden;
  //   if (ist.notUndefined(dto.visible)) model.visible = dto.visible;
  //   await model.save({ transaction });
  //   return model;
  // }


  // /**
  //  * SoftDelete the Image
  //  * 
  //  * @param arg
  //  */
  // async softDelete(arg: {
  //   model: ImageModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<ImageModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.destroy({ transaction });
  //   return model;
  // }


  // /**
  //  * HardDelete the Image
  //  * 
  //  * @param arg
  //  */
  // async hardDelete(arg: {
  //   model: ImageModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<ImageModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.destroy({ transaction, force: true, });
  //   return model;
  // }




  // /**
  //  * Restore the Image
  //  * 
  //  * @param arg
  //  */
  // async restore(arg: {
  //   model: ImageModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<ImageModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.restore({ transaction });
  //   return model;
  // }
}
