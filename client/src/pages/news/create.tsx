import { Box, Button, ButtonGroup, CircularProgress, Grid, Input, InputLabel, LinearProgress, makeStyles, Paper, Switch, TextField, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { FormEventHandler, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { normaliseApiException, rethrow } from "../../backend-api/make-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { Markdown } from "../../components/markdown/markdown";
import { ApiContext } from "../../contexts/api.context";
import { CreateNewsArticle, CreateNewsArticleMutationVariables, } from "../../generated/graphql";
import { pretty } from "../../helpers/pretty.helper";
import { serverSidePropsHandler } from "../../helpers/server-side-props-handler.helper";
import { staticPathsHandler, staticPropsHandler } from "../../helpers/static-props-handler.helper";


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
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
  teaserInput: {
    minHeight: '5em',
  },
  bodyInput: {
    minHeight: '10em',
  },
  label: {
    paddingBottom: theme.spacing(1),
  },
  markdownContainer: {
    paddingTop: '1em',
  },
}));

interface ICreateNewsPageProps {
  //
}

function CreateNewsPage(props: ICreateNewsPageProps) {
  const {} = props;
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [body, setBody] = useState('');
  const [autoSave, setAutoSave] = useState(true);

  const [postNewsArticle, result] = useMutation<CreateNewsArticle, IApiException, CreateNewsArticleMutationVariables>(
    async (vars: CreateNewsArticleMutationVariables): Promise<CreateNewsArticle> => {
      console.log('test 1');
      const result = await api
        .connector
        .graphql<CreateNewsArticle, CreateNewsArticleMutationVariables>(createNewsQuery, vars)
        .catch(rethrow(normaliseApiException));
      console.log('test 2');
      return result;
    },
  );

  const err = result.error;
  const isDisabled = result.isLoading;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              postNewsArticle({ title, teaser, body });
            }}>

            <Grid container spacing={2}>
              {/* settings & actions */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="space-around" alignItems="center">
                  <Box>
                    <Box display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                      <Typography className={classes.centered} component="span" variant="body2">
                        autosave
                      </Typography>
                      <Switch
                        color="primary"
                        checked={autoSave}
                        onChange={() => setAutoSave(!autoSave)}
                        name="auto save"
                        inputProps={{ 'aria-label': 'auto save' }}
                      />
                    </Box>
                    <Typography className={classes.centered} component="div" variant="body2" color="textSecondary">
                      not saved
                    </Typography>
                  </Box>
                  <Box>
                    <ButtonGroup>
                      <Button disabled={isDisabled} type="submit" color="primary" variant="outlined">
                        {'Save'}
                      </Button>
                      <Button disabled={isDisabled} type="submit" color="secondary" variant="outlined">
                        {'Delete'}
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} />


              {/* progress */}
              {isDisabled && (
                <>
                  <Grid item xs={12} sm={6}><LinearProgress /></Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              {/* title */}
              <Grid item xs={12} sm={6}>
                  <InputLabel
                    className={classes.label}
                    htmlFor="news_article_title">title</InputLabel>
                  <TextField
                    id="news_article_title"
                    variant="standard"
                    error={!!err?.data?.title}
                    helperText={err?.data?.title?.join('\n')}
                    disabled={isDisabled}
                    className={classes.fullWidth}
                    onChange={(evt) => setTitle(evt.target.value)}
                    value={title}
                  />
              </Grid>
              <Grid item xs={12} sm={6} />


              {/* teaser */}
              <Grid item xs={12} sm={6}>
                <InputLabel
                  className={classes.label}
                  htmlFor="news_article_teaser">teaser</InputLabel>
                <TextField
                  id="news_article_teaser"
                  variant="outlined"
                  helperText={err?.data?.teaser?.join('\n')}
                  disabled={isDisabled}
                  className={classes.fullWidth}
                  inputProps={{ className: classes.bodyInput }}
                  multiline
                  onChange={(evt) => setTeaser(evt.target.value)}
                  value={teaser}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.markdownContainer}>
                  <Markdown>
                    {teaser}
                  </Markdown>
                </Box>
              </Grid>
            </Grid>

            {/* body */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel
                  className={classes.label}
                  htmlFor="news_article_body">body</InputLabel>
                <TextField
                  id="news_article_body"
                  variant="outlined"
                  helperText={err?.data?.body?.join('\n')}
                  disabled={isDisabled}
                  className={classes.fullWidth}
                  inputProps={{ className: classes.bodyInput }}
                  multiline
                  onChange={(evt) => setBody(evt.target.value)}
                  value={body}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.markdownContainer}>
                  <Markdown>
                    {body}
                  </Markdown>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
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

export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
  return {
    fallback: false,
    paths: [],
  };
})

export default CreateNewsPage;