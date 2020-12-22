import { Association } from "sequelize";
import { UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostModel } from "../blog-post/blog-post.model";
import { BlogPostCommentModel } from "./blog-post-comment.model";

export interface BlogPostCommentAssociations {
  [index: string]: Association;
  author: Association<BlogPostCommentModel, UserModel>;
  post: Association<BlogPostCommentModel, BlogPostModel>;
  // reactions: Association<BlogPostCommentModel, BlogPostCommentReactionModel>;
}

export const BlogPostCommentAssociation: K2K<BlogPostCommentAssociations> = {
  author: 'author',
  post: 'post',
  // reactions: 'reactions',
}
