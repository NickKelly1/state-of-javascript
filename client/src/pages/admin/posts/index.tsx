import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React from "react";
import { useQuery } from "react-query";
import { ApiException } from "../../../backend-api/api.exception";
import { PAGINATION_GQL_FRAGMENT } from "../../../backend-api/fragments/pagination.gql.fragment";
import { useDebugMode } from "../../../components-contexts/debug-mode.context";
import { WithApi } from "../../../components-hoc/with-api/with-api.hoc";
import { WithLoadable } from "../../../components-hoc/with-loadable/with-loadable";
import { BLOG_POST_STATUS_ACTIONS_GQL_FRAGMENT } from "../../../components/blog-post-statuses/blog-post-status.actions.gql.fragment";
import { BLOG_POST_STATUS_DATA_GQL_FRAGMENT } from "../../../components/blog-post-statuses/blog-post-status.data.gql.fragment";
import { BLOG_POST_ACTIONS_GQL_FRAGMENT } from "../../../components/blog-posts/blog-post.actions.gql.fragment";
import { BLOG_POST_COLLECTION_ACTIONS_GQL_FRAGMENT } from "../../../components/blog-posts/blog-post.collection.actions.gql.fragment";
import { BLOG_POST_DATA_GQL_FRAGMENT } from "../../../components/blog-posts/blog-post.data.gql.fragment";
import { PostTeaserList, IPostTeaserList, IPostTeaserListItem, } from "../../../components/blog-posts/post.teaser.list";
import { JsonDialog } from "../../../components/debug-json-dialog/json-dialog";
import { Icons } from "../../../components/icons/icons.const";
import { USER_ACTIONS_GQL_FRAGMENT } from "../../../components/users/user.actions.gql.fragment";
import { USER_DATA_GQL_FRAGMENT } from "../../../components/users/user.data.gql.fragment";
import {
  PostsAdminPageQueryVariables,
  PostsAdminPageQuery,
} from "../../../generated/graphql";
import { hidex } from "../../../helpers/hidden.helper";
import { ist } from "../../../helpers/ist.helper";
import { useDialog } from "../../../hooks/use-dialog.hook";
import { OrUndefined } from "../../../types/or-undefined.type";
import remark from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';
import parse from 'remark-parse';
import { staticPropsHandler } from "../../../helpers/static-props-handler.helper";



const postsAdminPageQueryName = 'PostsAdminPageQueryName';
const postsAdminPageQuery = gql`
query PostsAdminPage($query:BlogPostQuery){
  blogPosts(query:$query){
    pagination{ ...Pagination }
    can{ ...BlogPostCollectionActions }
    nodes{
      cursor
      can{ ...BlogPostActions }
      data{ ...BlogPostData }
      relations{
        author{
          can{ ...UserActions }
          data{ ...UserData }
        }
        status{
          can{ ...BlogPostStatusActions }
          data{ ...BlogPostStatusData }
        }
      }
    }
  }
}

${PAGINATION_GQL_FRAGMENT}
${BLOG_POST_DATA_GQL_FRAGMENT}
${BLOG_POST_ACTIONS_GQL_FRAGMENT}
${USER_ACTIONS_GQL_FRAGMENT}
${USER_DATA_GQL_FRAGMENT}
${BLOG_POST_COLLECTION_ACTIONS_GQL_FRAGMENT}
${BLOG_POST_STATUS_DATA_GQL_FRAGMENT}
${BLOG_POST_STATUS_ACTIONS_GQL_FRAGMENT}
`;


interface IPostsAdminPageProps {
  list: IPostTeaserList;
}

const PostsAdminPage = WithApi<IPostsAdminPageProps>((props) => {
  const {
    api,
    me,
    list,
  } = props;

  //

  // const query = useQuery<OrUndefined<IPostTeaserList>, ApiException>(
  //   [postsAdminPageQueryName, me.hash],
  //   async (): Promise<OrUndefined<IPostTeaserList>> => {
  //     const vars: PostsAdminPageQueryVariables = {
  //       query: {
  //         offset: 0,
  //         limit: 5,
  //       },
  //     };
  //     const result = await api.gql<PostsAdminPageQuery, PostsAdminPageQueryVariables>(
  //       postsAdminPageQuery,
  //       vars,
  //     );

  //     // const html2 = await ;
  //     // const markdownify = (markdown: string) => remark().use(html).use(prism).process(markdown);
  //     const markdownify = (markdown: string) => remark().use(html).process(markdown);
  //     // const markdownify = (markdown: string) => Promise.resolve({ toString() { return markdown; }, });

  //     const list: IPostTeaserList = {
  //       pagination: result.blogPosts.pagination,
  //       items: await Promise.all(result
  //         .blogPosts
  //         .nodes
  //         .filter(ist.notNullable)
  //         .map(async (item): Promise<IPostTeaserListItem> => ({
  //           data: {
  //             id: item.data.id,
  //             title: item.data.title,
  //             image: null,
  //             teaser: await markdownify(item.data.teaser).then(res => res.toString()),
  //             body: await markdownify(item.data.body).then(res => res.toString()),
  //             author_name: item.relations.author?.data.name,
  //             status_name: item.relations.status?.data.name,
  //           },
  //         }))
  //       ),
  //     };
  //     return list;
  //   },
  // );

  const debugMode = useDebugMode();
  const debugDialog = useDialog();

  return (
    <>
      <JsonDialog title="Posts Query" dialog={debugDialog} data={list} />
      <Grid container spacing={2}>
        <Grid className="d-flex jfs aic" item xs={12}>
          <Typography component="h1" variant="h1">
            Blog Posts
          </Typography>
          <Box className={hidex(!debugMode.isOn)} ml={1}>
            <IconButton color="primary" onClick={debugDialog.doToggle}>
              <Icons.Debug />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PostTeaserList list={list} />
          {/* <WithLoadable
            isLoading={query.isLoading}
            error={query.error}
            data={query.data}
          >
            {(blogPosts) => <PostTeaserList list={blogPosts} />}
          </WithLoadable> */}
        </Grid>
      </Grid>
    </>
  );
});

export default PostsAdminPage;

export const getStaticProps = staticPropsHandler<IPostsAdminPageProps>(async ({ api }) => {
  //

  const vars: PostsAdminPageQueryVariables = {
    query: {
      offset: 0,
      limit: 5,
    },
  };

  const result = await api.gql<PostsAdminPageQuery, PostsAdminPageQueryVariables>(
    postsAdminPageQuery,
    vars,
  );

  // const html2 = await ;
  // const markdownify = (markdown: string) => remark().use(html).use(prism).process(markdown);
  // const markdownify = (markdown: string) => remark().use(html).process(markdown);
  // const markdownify = (markdown: string) => Promise.resolve({ toString() { return markdown; }, });

  const list: IPostTeaserList = {
    pagination: result.blogPosts.pagination,
    items: await Promise.all(result
      .blogPosts
      .nodes
      .filter(ist.notNullable)
      .map(async (item): Promise<IPostTeaserListItem> => ({
        data: {
          id: item.data.id,
          title: item.data.title,
          image: null,
          teaser: await markdownify(item.data.teaser).then(res => res.toString()),
          body: await markdownify(item.data.body).then(res => res.toString()),
          author_name: item.relations.author?.data.name,
          status_name: item.relations.status?.data.name,
        },
      }))
    ),
  };

  const props: IPostsAdminPageProps = {
    list,
  }

  return {
    // undefined can't be serialized... so get rid of it
    props: JSON.parse(JSON.stringify(props)),
  };
});
