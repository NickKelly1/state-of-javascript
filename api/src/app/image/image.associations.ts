import { Association } from "sequelize";
import { ImageModel, FileModel, } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostModel } from "../blog-post/blog-post.model";

export interface ImageAssociations {
  [index: string]: Association;
  thumbnail: Association<ImageModel, FileModel>;
  display: Association<ImageModel, FileModel>;
  original: Association<ImageModel, FileModel>;
  posts: Association<ImageModel, BlogPostModel>;
}

export const ImageAssociation: K2K<ImageAssociations> = {
  thumbnail: 'thumbnail',
  display: 'display',
  original: 'original',
  posts: 'posts',
}
