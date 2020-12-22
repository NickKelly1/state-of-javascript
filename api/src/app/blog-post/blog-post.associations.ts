import { Association } from "sequelize";
import { BlogPostStatusModel, UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostCommentModel } from "../blog-post-comment/blog-post-comment.model";
import { BlogPostModel } from "./blog-post.model";

export interface BlogPostAssociations {
  [index: string]: Association;
  author: Association<BlogPostModel, UserModel>;
  status: Association<BlogPostModel, BlogPostStatusModel>;
  comments: Association<BlogPostModel, BlogPostCommentModel>;
}

export const BlogPostAssociation: K2K<BlogPostAssociations> = {
  author: 'author',
  status: 'status',
  comments: 'comments',
}
