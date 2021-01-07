import { Association } from "sequelize";
import { UserModel, FileModel, } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { ImageModel } from "../image/image.model";

export interface FileAssociations {
  [index: string]: Association;
  uploader: Association<FileModel, UserModel>;
  display_images: Association<FileModel, ImageModel>;
  thumbnail_images: Association<FileModel, ImageModel>;
  original_images: Association<FileModel, ImageModel>;
}

export const FileAssociation: K2K<FileAssociations> = {
  uploader: 'uploader',
  display_images: 'display_images',
  original_images: 'original_images',
  thumbnail_images: 'thumbnail_images',
}
