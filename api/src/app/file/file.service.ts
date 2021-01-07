import { FileModel } from '../../circle';
import sharp from 'sharp';
import { BaseContext } from '../../common/context/base.context';
import { ist } from '../../common/helpers/ist.helper';
import { IWhoami } from '../../common/interfaces/whoami.interface';
import { BlogPostModel } from '../blog-post/blog-post.model';
import { QueryRunner } from '../db/query-runner';
import { UserModel } from '../user/user.model';
import { nanoid } from 'nanoid';
import path from 'path';
import { fst } from 'fp-ts/lib/ReadonlyTuple';
import fs from 'fs/promises';
import { OrNullable } from '../../common/types/or-nullable.type';
import { filenameify } from '../../common/helpers/filenameify.helper';
import mv from 'mv';

export interface IFileServiceCreateFileDto {
  is_public: boolean;
  mimetype: string;
  encoding: string;
  title: string;
  in_file: string;
  out_filename: OrNullable<string>;
  mv: boolean;
  uploader: IWhoami;
}

export class FileService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Create a File
   *
   * Involves filesystem operations
   *
   * Cannot be run within a transaction because works on the filesystem so could take some time...
   *
   * @param arg
   */
  async untransactedCreate(arg: {
    runner: null;
    dto: IFileServiceCreateFileDto,
  }): Promise<FileModel> {
    const { dto, runner, } = arg;
    const { title, mv: _mv, is_public, encoding, in_file, mimetype, uploader, out_filename, } = dto;

    const _out_filename = out_filename ?? `${filenameify()}.${path.extname(in_file)}`;

    const out_file = path.normalize(path.join(
      this.ctx.services.universal.env.UPLOADS_DIR,
      `./${_out_filename}`,
    ));

    // move or copy file...
    if (mv) {
      // move
      // https://stackoverflow.com/questions/44146393/error-exdev-cross-device-link-not-permitted-rename-nodejs
      await new Promise((res, rej) => mv(
        in_file,
        out_file,
        { clobber: false, },
        (err) => err ? rej(err) : res(undefined)),
      );
    } else {
      // copy
      await fs.copyFile(in_file, out_file);
    }

    // create model
    const file = FileModel.build({
      uploader_aid: uploader.aid ?? null,
      uploader_id: uploader.user_id ?? null,
      encoding: encoding,
      filename: _out_filename,
      is_public: is_public,
      mimetype: mimetype,
      title,
    });

    await file.save({ transaction: undefined });

    return file;
  }


  // /**
  //  * Update the File
  //  *
  //  * @param arg
  //  */
  // async update(arg: {
  //   runner: QueryRunner;
  //   post: BlogPostModel;
  //   author: UserModel;
  //   model: FileModel;
  //   dto: IFileServiceUpdateFileDto,
  // }): Promise<FileModel> {
  //   const { runner, author, post, model, dto } = arg;
  //   const { transaction } = runner;
  //   if (ist.notUndefined(dto.body)) model.body = dto.body;
  //   if (ist.notUndefined(dto.hidden)) model.hidden = dto.hidden;
  //   if (ist.notUndefined(dto.visible)) model.visible = dto.visible;
  //   await model.save({ transaction });
  //   return model;
  // }


  // /**
  //  * SoftDelete the File
  //  * 
  //  * @param arg
  //  */
  // async softDelete(arg: {
  //   model: FileModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<FileModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.destroy({ transaction });
  //   return model;
  // }


  // /**
  //  * HardDelete the File
  //  * 
  //  * @param arg
  //  */
  // async hardDelete(arg: {
  //   model: FileModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<FileModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.destroy({ transaction, force: true, });
  //   return model;
  // }




  // /**
  //  * Restore the File
  //  * 
  //  * @param arg
  //  */
  // async restore(arg: {
  //   model: FileModel;
  //   author: UserModel,
  //   post: BlogPostModel;
  //   runner: QueryRunner;
  // }): Promise<FileModel> {
  //   const { model, author, post, runner } = arg;
  //   const { transaction } = runner;
  //   await model.restore({ transaction });
  //   return model;
  // }
}
