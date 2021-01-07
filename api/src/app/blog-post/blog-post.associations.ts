import { Association } from "sequelize";
import { BlogPostStatusModel, UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostCommentModel } from "../blog-post-comment/blog-post-comment.model";
import { ImageModel } from "../image/image.model";
import { BlogPostModel } from "./blog-post.model";

export interface BlogPostAssociations {
  [index: string]: Association;
  author: Association<BlogPostModel, UserModel>;
  status: Association<BlogPostModel, BlogPostStatusModel>;
  image: Association<BlogPostModel, ImageModel>;
  comments: Association<BlogPostModel, BlogPostCommentModel>;
}

export const BlogPostAssociation: K2K<BlogPostAssociations> = {
  author: 'author',
  status: 'status',
  image: 'image',
  comments: 'comments',
}
