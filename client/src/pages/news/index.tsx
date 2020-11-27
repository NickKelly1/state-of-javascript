import { Button, Grid, ListItem, makeStyles, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { gql } from "graphql-request";
import React, { useContext, } from "react";
import { ApiContext } from "../../components-contexts/api.context";
import { IndexNewsPageQuery, IndexNewsPageQueryVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { staticPropsHandler } from "../../helpers/static-props-handler.helper";
import { INewsArticleTeaserProps, NewsArticleTeaser } from "../../components/news/news-article.teaser";
import { WithMemo } from "../../components-hoc/with-memo/with-memo";

const pageQuery = gql`
query IndexNewsPage(
  $news_offset:Int
  $news_limit:Int
){
  newsArticles(
    query:{
      offset:$news_offset
      limit:$news_limit
    }
  ){
    pagination{
      limit
      offset
      total
      page_number
      pages
      more
    }
    can{
      show
      create
    }
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
          cursor
          can{
            show
            update
            softDelete
            hardDelete
          }
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
    // textAlign: 'center',
  },
  create_btn: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));


interface IIndexNewsPageProps {
  query: IndexNewsPageQuery;
}

function IndexNewsPage(props: IIndexNewsPageProps) {
  const { query } = props;
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">News</Typography>
      </Grid>
      {query.newsArticles.can.create && (
        <Grid item xs={12}>
          <ListItem>
            <NextLink href="/news/create" passHref>
              <MUILink className={classes.create_btn} color="inherit">
                <Button variant="outlined" color="primary">
                  Create article
                </Button>
              </MUILink>
            </NextLink>
          </ListItem>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {query.newsArticles.nodes.filter(ist.notNullable).map(node => (
            <Grid key={node.data.id} item xs={12}>
              <WithMemo<INewsArticleTeaserProps>
                deps={[node]}
                memo={(): INewsArticleTeaserProps => ({
                  node: {
                    data: {
                      id: node.data.id,
                      title: node.data.title,
                      teaser: node.data.teaser,
                      author_id: node.data.author_id,
                      created_at: new Date(node.data.created_at),
                      updated_at: new Date(node.data.updated_at),
                      deleted_at: node.data.deleted_at ? new Date(node.data.deleted_at) : null,
                    },
                    can: {
                      softDelete: node.can.softDelete,
                      update: node.can.update,
                      show: node.can.show,
                    },
                    relations: {
                      author: ist.nullable(node.relations.author)
                        ? null
                        : {
                          data: {
                            id: node.relations.author.data.id,
                            name: node.relations.author.data.name,
                          },
                        },
                    },
                  },
                })}>
                {(teaserProps) => (<NewsArticleTeaser {...teaserProps} />)}
              </WithMemo>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}


export const getStaticProps = staticPropsHandler<IIndexNewsPageProps>(async ({ ctx, cms, npmsApi, api }) => {
  const query = await api.gql<IndexNewsPageQuery, IndexNewsPageQueryVariables>(
    pageQuery,
    {
      news_limit: 10,
      news_offset: 0,
    },
  );

  const props: IIndexNewsPageProps = {
    query,
  };


  return {
    props,
    // revalidate: false,
  };
});


// export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
//   return {
//     fallback: false,
//     paths: [],
//   };
// })


export default IndexNewsPage;
