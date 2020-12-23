import { CircularProgress, Grid, Input, InputLabel, LinearProgress, makeStyles, Paper, Switch, TextField, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { useCallback, } from "react";
import { useMutation } from "react-query";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { CreateNewsArticle, CreateNewsArticleMutationVariables, } from "../../generated/graphql";
import { INewsArticleMutateFormData, NewsArticleMutateForm } from "../../components/news/news-article.form";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";


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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICreateNewsPageProps {
  //
}

const CreateNewsPage = WithApi<ICreateNewsPageProps>((props) => {
  const { api, me } = props;
  const classes = useStyles();

  const [postNewsArticle, result] = useMutation<CreateNewsArticle, IApiException, CreateNewsArticleMutationVariables>(
    async (vars: CreateNewsArticleMutationVariables): Promise<CreateNewsArticle> => {
      const result = await api.gql<CreateNewsArticle, CreateNewsArticleMutationVariables>(
        createNewsQuery,
        vars
      );
      return result;
    },
  );

  const handleSave = useCallback(async (data: INewsArticleMutateFormData): Promise<boolean> => {
    const { title, teaser, body } = data;
    await postNewsArticle({ title, teaser, body });
    return true;
  }, [postNewsArticle]);

  return (
    <NewsArticleMutateForm
      id={undefined}
      onSave={handleSave}
      onAutoSave={undefined}
      error={result.error}
      isDisabled={result.isLoading}
      lastSavedAt={undefined}
      canShow={false}
      canSoftDelete={false}
      // TODO: canSave
      canSave={true}
      initial={{
        body: '',
        teaser: '',
        title: '',
      }}
    />
  );
})

// export const getStaticProps = staticPropsHandler<ICreateNewsPageProps>(async ({ ctx, cms, npmsApi, api }) => {
//   const props: ICreateNewsPageProps = {
//     //
//   };


//   return {
//     props,
//     // revalidate: false,
//   };
// });

// export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
//   return {
//     fallback: false,
//     paths: [],
//   };
// })

export default CreateNewsPage;