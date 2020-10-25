import { Box, Button, ButtonGroup, CircularProgress, Grid, Input, InputLabel, LinearProgress, makeStyles, Paper, Switch, TextField, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { gql } from "graphql-request";
import { ApiError } from "next/dist/next-server/server/api-utils";
import React, { FormEventHandler, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { normaliseApiException, rethrow } from "../../backend-api/make-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { Markdown } from "../markdown/markdown";
import { ApiContext } from "../../contexts/api.context";
import { CreateNewsArticle, CreateNewsArticleMutationVariables, } from "../../generated/graphql";
import { pretty } from "../../helpers/pretty.helper";
import { serverSidePropsHandler } from "../../helpers/server-side-props-handler.helper";
import { staticPathsHandler, staticPropsHandler } from "../../helpers/static-props-handler.helper";
import { OrNullable } from "../../types/or-nullable.type";
import { OrUndefined } from "../../types/or-undefined.type";


const useStyles = makeStyles((theme) => ({
  root: {
    //
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

export interface INewsArticleFormData {
  title: string;
  teaser: string;
  body: string;
}

export interface ICreateNewsPageProps {
  id: OrNullable<number>;
  onSave: OrNullable<((data: INewsArticleFormData) => unknown)>;
  onAutoSave: OrNullable<((data: INewsArticleFormData) => unknown)>;
  lastSavedAt: OrNullable<number>;
  initial: OrNullable<INewsArticleFormData>;
  isDisabled: boolean;
  error: OrNullable<IApiException>;
  canShow: boolean;
  canSave: boolean;
  canDelete: boolean;
}

export function NewsArticleForm(props: ICreateNewsPageProps) {
  const {
    id,
    onSave,
    initial,
    isDisabled,
    error,
    canShow,
    canSave,
    canDelete,
  } = props;
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [teaser, setTeaser] = useState(initial?.teaser ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [autoSave, setAutoSave] = useState(true);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              onSave?.({ title, teaser, body });
            }}>
            <Grid container spacing={2}>
              {/* settings & actions */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="space-around" alignItems="center">
                  <Box>
                    <Box display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                      <Typography className="centered" component="span" variant="body2">
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
                    <Typography className="centered" component="div" variant="body2" color="textSecondary">
                      not saved
                    </Typography>
                  </Box>
                  <Box className="centered">
                    {(id && canShow) && (
                      <Box m={1}>
                        <NextLink href={`/news/view/${id}`} passHref>
                          <MUILink className="btn-link" color="inherit">
                            <Button disabled={isDisabled} color="primary" variant="outlined">
                              {'View'}
                            </Button>
                          </MUILink>
                        </NextLink>
                      </Box>
                    )}
                    {canSave && (
                      <Box m={1}>
                        <Button disabled={isDisabled} type="submit" color="primary" variant="outlined">
                          {'Save'}
                        </Button>
                      </Box>
                    )}
                    {canDelete && (
                      <Box m={1}>
                        <Button disabled={isDisabled} color="secondary" variant="outlined">
                          {'Delete'}
                        </Button>
                      </Box>
                    )}
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
                    error={!!error?.data?.title}
                    helperText={error?.data?.title?.join('\n')}
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
                  helperText={error?.data?.teaser?.join('\n')}
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
                  helperText={error?.data?.body?.join('\n')}
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
