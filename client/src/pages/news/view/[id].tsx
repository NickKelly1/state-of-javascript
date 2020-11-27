import { Box, Button, ButtonGroup, Grid, Input, InputLabel, ListItem, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { gql } from "graphql-request";
import React, { useContext, } from "react";
import { ApiContext } from "../../../components-contexts/api.context";
import { ViewNewsArticlePageQuery, ViewNewsArticlePageQueryVariables } from "../../../generated/graphql";
import { ist } from "../../../helpers/ist.helper";
import { staticPathsHandler, staticPropsHandler } from "../../../helpers/static-props-handler.helper";
import { Api } from "../../../backend-api/api";
import { serverSidePropsHandler } from "../../../helpers/server-side-props-handler.helper";
import { Markdown } from "../../../components/markdown/markdown";
import { OrNull } from "../../../types/or-null.type";
import { GetServerSidePropsResult } from "next";

const pageQuery = gql`
query ViewNewsArticlePage(
  $news_article_id:Float!
){
  newsArticles(
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


interface IViewNewsArticlePageProps {
  query: OrNull<ViewNewsArticlePageQuery>;
}

function ViewNewsArticlePage(props: IViewNewsArticlePageProps) {
  const { query } = props;
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();
  const article = query?.newsArticles.nodes[0];

  if (!article) {
    return (
      <div>
        nothing...
      </div>
    );
  }

  // TODO:
  //  if not found & on client, try to find again after authorizing
  // const article = query.newsArticles.nodes.forEach(node => node?.relations.)

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
}

async function runPageQuery(arg: { id: number, api: Api }): Promise<ViewNewsArticlePageQuery> {
  const { id, api } = arg;
  const query = await api.gql<ViewNewsArticlePageQuery, ViewNewsArticlePageQueryVariables>(
    pageQuery,
    { news_article_id: id },
  );
  return query;
}

export const getServerSideProps = serverSidePropsHandler<IViewNewsArticlePageProps>(async ({ api, ctx }) => {
  let id: OrNull<number> = null;
  const pId = ctx?.params?.id
  if (ist.defined(pId)) {
    if (Array.isArray(pId)) { id = parseInt(pId[0], 10); }
    else { id = parseInt(pId, 10); }
  }
  let query: OrNull<ViewNewsArticlePageQuery> = null;
  if (ist.defined(id) && Number.isFinite(id)) { query = await runPageQuery({ id, api }); }
  return { props: { query }, };
});

export default ViewNewsArticlePage;