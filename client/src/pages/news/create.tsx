import { Box, Button, ButtonGroup, CircularProgress, Grid, Input, InputLabel, LinearProgress, makeStyles, Paper, Switch, TextField, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../components-contexts/api.context";
import { CreateNewsArticle, CreateNewsArticleMutationVariables, } from "../../generated/graphql";
import { staticPathsHandler, staticPropsHandler } from "../../helpers/static-props-handler.helper";
import { INewsArticleFormData, NewsArticleForm } from "../../components/news/news-article.form";


const createNewsQuery = gql`
mutation CreateNewsArticle(
  $title:String!
  $teaser:String!
  $body:String!
){
  createNewsArticle(
    dto:{
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
    //
  },
}));

interface ICreateNewsPageProps {
  //
}

function CreateNewsPage(props: ICreateNewsPageProps) {
  const {} = props;
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();

  const [postNewsArticle, result] = useMutation<CreateNewsArticle, IApiException, CreateNewsArticleMutationVariables>(
    async (vars: CreateNewsArticleMutationVariables): Promise<CreateNewsArticle> => {
      const result = await api
        .connector
        .graphql<CreateNewsArticle, CreateNewsArticleMutationVariables>(createNewsQuery, vars)
        .catch(rethrow(normaliseApiException));
      return result;
    },
  );

  const handleSave = useCallback(async (data: INewsArticleFormData): Promise<boolean> => {
    const { title, teaser, body } = data;
    await postNewsArticle({ title, teaser, body });
    return true;
  }, [postNewsArticle]);

  return (
    <NewsArticleForm
      id={undefined}
      onSave={handleSave}
      onAutoSave={undefined}
      error={result.error}
      isDisabled={result.isLoading}
      lastSavedAt={undefined}
      canShow={false}
      canDelete={false}
      // TODO: canSave
      canSave={true}
      initial={{
        body: '',
        teaser: '',
        title: '',
      }}
    />
  );
}

export const getStaticProps = staticPropsHandler<ICreateNewsPageProps>(async ({ ctx, cms, npmsApi, api }) => {
  const props: ICreateNewsPageProps = {
    //
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

export default CreateNewsPage;