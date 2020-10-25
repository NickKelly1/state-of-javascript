import { Box, Button, Grid, Input, InputLabel, ListItem, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { gql } from "graphql-request";
import React, { useContext, } from "react";
import { Permission } from "../../../backend-api/services/permission/permission.const";
import { ApiContext } from "../../../contexts/api.context";
import { IndexNewsPageQuery as ViewNewsPageQuery, IndexNewsPageQueryVariables } from "../../../generated/graphql";
import { ist } from "../../../helpers/ist.helper";
import { staticPathsHandler, staticPropsHandler } from "../../../helpers/static-props-handler.helper";

const pageQuery = gql`
query ViewNewsPage{
  newsArticles(
    query:{
      offset:0
      limit:1
    }
  ){
    nodes{
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

function ViewNewsArticlePage() {
  //
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // textAlign: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  create_btn: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));


interface IViewNewsPageProps {
  query: ViewNewsPageQuery;
}

function ViewNewsPage(props: IViewNewsPageProps) {
  const { query } = props;
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">News</Typography>
      </Grid>
      {me?.hasSomePermissions([Permission.CreateNewsArticle]) && (
        <Grid item xs={12}>
          <ListItem>
            <NextLink href="/news/create" passHref>
              <MUILink className={classes.create_btn} color="inherit">
                <Button color="primary">
                  Create article
                </Button>
              </MUILink>
            </NextLink>
          </ListItem>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {query.newsArticles.edges.filter(ist.notNullable).map(edge => (
            <Grid key={edge.node.id} item xs={12}>
              <Paper>
                <div>
                  {edge.node.title}
                </div>
                <div>
                  {edge.node.created_at}
                </div>
                <div>
                  {edge.node.teaser}
                </div>
                <div>
                  {edge.node.body}
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}


export const getStaticProps = staticPropsHandler<IViewNewsPageProps>(async ({ ctx, cms, npmsApi, api }) => {
  const query = await api.connector.graphql<ViewNewsPageQuery, IndexNewsPageQueryVariables>(
    pageQuery,
    {
      news_limit: 10,
      news_offset: 0,
    },
  );

  const props: IViewNewsPageProps = {
    query,
  };


  return {
    props,
    // revalidate: false,
  };
});

export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
  return {
    fallback: false,
    paths: [],
  };
})

export default ViewNewsPage;