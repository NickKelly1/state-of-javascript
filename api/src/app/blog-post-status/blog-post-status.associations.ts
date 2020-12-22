import { Association } from "sequelize";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostModel } from "../blog-post/blog-post.model";
import { BlogPostStatusModel } from "./blog-post-status.model";

export interface BlogPostStatusAssociations {
  [index: string]: Association;
  posts: Association<BlogPostStatusModel, BlogPostModel>;
}

export const BlogPostStatusAssociation: K2K<BlogPostStatusAssociations> = {
  posts: 'posts',
}