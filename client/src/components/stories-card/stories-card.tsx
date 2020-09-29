import { Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { pretty } from '../../helpers/pretty.helper';
import { StorySdkResource } from '../../sdk/types/story.sdk.resource';
import { InlineImg } from '../inline-img/inline-img';
import { InlineSdkImg } from '../inline-img/inline-sdk-img';
import { MaybeLink } from '../maybe-link/maybe-link';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  }
}));

export interface IStoriesCardProps {
  stories: StorySdkResource[];
}

export function StoriesCard(props: IStoriesCardProps) {
  const { stories } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" color="primary">
            News
          </Typography>
        </Grid>
        {stories.map((story, i) => (
          <Fragment key={i}>
            <Grid className="centered" item xs={2}>
              {
                story.icon?.url ? (
                  <InlineSdkImg src={story.icon?.url} />
                )
                : story.topic?.icon?.url ? (
                  <InlineSdkImg src={story.topic?.icon?.url} />
                )
                : null
              }
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" component="p" color="inherit">
                <MaybeLink href={story.source} color="inherit">
                  {story.title}
                </MaybeLink>
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" component="p" color="inherit">
                <MaybeLink href={story.source} color="inherit">
                  {story.description}
                </MaybeLink>
              </Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Paper>
  );
}