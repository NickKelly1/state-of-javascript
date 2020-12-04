import { Grid, Typography } from "@material-ui/core";
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import React from "react";
import { staticPathsHandler, staticPropsHandler } from "../../helpers/static-props-handler.helper"
import { IPostMatter } from "../../types/post-matter.type";
import { postSsFns } from "../../helpers/post-ss-fns.helper";
import { GetStaticPathsResult } from "next";
import remark from 'remark';
import remarkHtml from 'remark-html';


interface IPostProps {
  post: IPostMatter;
}


const Post = (props: IPostProps) => {
  const { post } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">
          {post.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        {/* <Typography>
          {post.content}
        </Typography> */}
      </Grid>
    </Grid>

  );
}


async function mdToHtml(markdown: string) {
  const result = await remark()
    .use(remarkHtml)
    .process(markdown)

  return result.toString();
}

type IPostParams = { slug: string };

export const getStaticProps = staticPropsHandler<IPostProps, IPostParams>(async ({
  api,
  cms,
  ctx,
  npmsApi,
  publicEnv,
}) => {
  const post = await postSsFns.getPostBySlug(ctx.params?.slug!, [
    'title',
    'slug',
    'content',
  ]);
  post.content = await mdToHtml(post.content);
  const props: IPostProps = { post };
  return {
    props,
  };
});

export const getStaticPaths = staticPathsHandler(async ({
  api,
  cms,
  npmsApi,
  publicEnv,
}): Promise<GetStaticPathsResult<IPostParams>> => {
  const posts = await postSsFns.getAllPosts([
    'title',
    'slug',
    'content',
  ]);



  const result: GetStaticPathsResult<IPostParams> = {
    fallback: false,
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
  };

  return result;
});

export default Post;