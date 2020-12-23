import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { gql } from "graphql-request";
import React from "react";
import {
  ViewBlogPostPageQuery,
  ViewBlogPostPageQueryVariables,
} from "../../../generated/graphql";
import { ist } from "../../../helpers/ist.helper";
import { serverSidePropsHandler } from "../../../helpers/server-side-props-handler.helper";
import { Markdown } from "../../../components/markdown/markdown";
import { OrNull } from "../../../types/or-null.type";
import { WithApi } from "../../../components-hoc/with-api/with-api.hoc";
import { Api } from "../../../backend-api/api";

const pageQuery = gql`
query ViewBlogPostPage(
  $news_article_id:Float!
){
  blogPosts(
    query:{
      offset:0
      limit:1
      filter:{
        attr:{
          id:{
            eq:$news_article_id
          }
        }
      }
    }
  ){
    nodes{
      cursor
      can{
        show
        update
        softDelete
        hardDelete
      }
      data{
        id
        title
        teaser
        body
        author_id
        created_at
        updated_at
        deleted_at
      }
      relations{
        author{
          data{
            id
            name
            created_at
            updated_at
            deleted_at
          }
        }
      }
    }
  }
}
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  btn_link: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));


interface IViewBlogPostPageProps {
  query: OrNull<ViewBlogPostPageQuery>;
}

const ViewBlogPostPage = WithApi<IViewBlogPostPageProps>((props) => {
  const { query, api, me  } = props;
  const classes = useStyles();
  const article = query?.blogPosts.nodes[0];

  if (!article) {
    return (
      <div>
        nothing...
      </div>
    );
  }

  // TODO:
  //  if not found & on client, try to find again after authorizing
  // const article = query.blogPosts.nodes.forEach(node => node?.relations.)

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid className="centered" item xs={12}>
            <Typography component="h1" variant="h1">
              {article.data.title}
            </Typography>
          </Grid>
          <Grid className="centered" item xs={12}>
            {article.can.update && (
              <Box m={1}>
                <NextLink href={`/news/edit/${article.data.id}`} passHref>
                  <MUILink className={classes.btn_link} color="inherit">
                    <Button variant="outlined" color="primary">
                      Edit
                    </Button>
                  </MUILink>
                </NextLink>
              </Box>
            )}
            {article.can.softDelete && (
              <Box m={1}>
                <Button variant="outlined" color="secondary">
                  Delete
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Markdown>
                {article.data.body}
              </Markdown>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
})

async function runPageQuery(arg: { id: number, api: Api }): Promise<ViewBlogPostPageQuery> {
  const { id, api } = arg;
  const query = await api.gql<ViewBlogPostPageQuery, ViewBlogPostPageQueryVariables>(
    pageQuery,
    { news_article_id: id },
  );
  return query;
}

export const getServerSideProps = serverSidePropsHandler<IViewBlogPostPageProps>(async ({ api, ctx }) => {
  let id: OrNull<number> = null;
  const pId = ctx?.params?.id
  if (ist.defined(pId)) {
    if (Array.isArray(pId)) { id = parseInt(pId[0], 10); }
    else { id = parseInt(pId, 10); }
  }
  let query: OrNull<ViewBlogPostPageQuery> = null;
  if (ist.defined(id) && Number.isFinite(id)) { query = await runPageQuery({ id, api }); }
  return { props: { query }, };
});

export default ViewBlogPostPage;
