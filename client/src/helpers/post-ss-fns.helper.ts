import { Grid, Typography } from "@material-ui/core";
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import React from "react";
import { IPostMatter } from "../types/post-matter.type";

const cwd = process.cwd();
const postsDir = path.normalize(path.join(cwd, '_posts'));

/**
 * Server-Side Post Functions
 */
export const postSsFns = {
  /**
   * Get post given a slug
   */
  async getPostBySlug(slug: string, fields: string[]): Promise<IPostMatter> {
    // remove ending .md if required
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, `${realSlug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf-8');
    const { data, content } = matter(fileContents);
    const items: IPostMatter = {};
    fields.forEach(field => {
      if (field === 'slug') { items[field] = realSlug; }
      else if (field === 'content') { items[field] = content; }
      else if (data[field]) { items[field] = data[field]; }
    });
    return items;
  },

  /**
   * Get all posts
   */
  async getAllPosts(fields: string[]): Promise<IPostMatter[]> {
    const slugs = await fs
      .readdir(postsDir, { withFileTypes: true })
      .then(items => items
        .filter(item => item.isFile())
        .map(item => item
          .name
          // .replace(/\.md$/, '')
        )
      );
    const posts = await Promise
      .all(slugs.map(slug => postSsFns.getPostBySlug(slug, fields)))
      .then(posts => posts.sort((posta, postb) => posta.date > postb.date ? -1 : 1));
    return posts;
  },
}