import { Box, Button, ButtonGroup, Grid, Input, InputLabel, ListItem, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { useCallback, } from "react";
import { EditNewsArticlePageQuery, UpdateNewsArticle, UpdateNewsArticleMutationVariables, ViewNewsArticlePageQuery, ViewNewsArticlePageQueryVariables } from "../../../generated/graphql";
import { ist } from "../../../helpers/ist.helper";
import { Api } from "../../../backend-api/api";
import { serverSidePropsHandler } from "../../../helpers/server-side-props-handler.helper";
import { OrNull } from "../../../types/or-null.type";
import { useMutation } from "react-query";
import { INewsArticleFormData, NewsArticleForm } from "../../../components/news/news-article.form";
import { ApiException } from "../../../backend-api/api.exception";
import { WithApi } from "../../../components-hoc/with-api/with-api.hoc";

const pageQuery = gql`
query EditNewsArticlePage(
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

const updateNewsQuery = gql`
mutation UpdateNewsArticle(
  $id:Int!
  $title:String
  $teaser:String
  $body:String
){
  updateNewsArticle(
    dto:{
      id:$id
      title:$title
      teaser:$teaser
      body:$body
    }
  ){
    data{
      id,
      title
      teaser
      body
      author_id
      created_at
      updated_at
      deleted_at
    }
  }
}
`

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


interface IEditNewsArticlePageProps {
  query: OrNull<EditNewsArticlePageQuery>;
}

export const EditNewsArticlePage = WithApi<IEditNewsArticlePageProps>((props) => {
  const { query, api, me, } = props;
  const classes = useStyles();
  const article = query?.newsArticles.nodes[0];

  const [saveNewsArticle, result] = useMutation<UpdateNewsArticle, ApiException, UpdateNewsArticleMutationVariables>(
    async (vars: UpdateNewsArticleMutationVariables): Promise<UpdateNewsArticle> => {
      const result = await api.gql<UpdateNewsArticle, UpdateNewsArticleMutationVariables>(
        updateNewsQuery,
        vars
      );
      return result;
    },
  );

  const handleSave = useCallback(async (data: INewsArticleFormData): Promise<boolean> => {
    const id = article?.data.id;
    if (ist.nullable(id)) throw new Error('id not defined...');
    const { title, teaser, body } = data;
    await saveNewsArticle({ id, title, teaser, body });
    return true;
  }, [article?.data.id, saveNewsArticle]);

  // TODO:
  //  if not found & on client, try to find again after authorizing
  // const article = query.newsArticles.nodes.forEach(node => node?.relations.)
  if (!article) {
    return (
      <div>
        nothing...
      </div>
    );
  }

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <NewsArticleForm
          id={article.data.id}
          onSave={handleSave}
          onAutoSave={undefined}
          error={result.error}
          isDisabled={result.isLoading}
          lastSavedAt={article.data.updated_at}
          initial={{
            title: article.data.title,
            teaser: article.data.teaser,
            body: article.data.body,
          }}
          canShow={article.can.show}
          canSave={article.can.update}
          canSoftDelete={article.can.softDelete}
        />
      </Grid>
    </Grid>
  );
});

async function runPageQuery(arg: { id: number, api: Api }): Promise<ViewNewsArticlePageQuery> {
  const { id, api } = arg;
  const query = await api.gql<ViewNewsArticlePageQuery, ViewNewsArticlePageQueryVariables>(
    pageQuery,
    { news_article_id: id },
  );
  return query;
}

export const getServerSideProps = serverSidePropsHandler<IEditNewsArticlePageProps>(async ({ api, ctx }) => {
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

export default EditNewsArticlePage;