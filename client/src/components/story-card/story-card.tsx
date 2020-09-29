import React, { useMemo } from 'react';
import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { StorySdkResource } from '../../sdk/types/story.sdk.resource';
import { formatRelative } from 'date-fns';
import { InlineSdkImg } from '../inline-img/inline-sdk-img';
import { MaybeLink } from '../maybe-link/maybe-link';


const useStyles = makeStyles((theme) => ({
  title: {
    // padding: theme.spacing(2),
  },
  subtitle: {
    // padding: theme.spacing(2),
  },
  content: {
    paddingTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

export interface IStoryCardProps {
  story: StorySdkResource;
}

function formatDate() {
  //
}

export function StoryCard(props: IStoryCardProps) {
  const { story } = props;
  const classes = useStyles();
  const updated = useMemo(() => {
    const now = new Date();
    const relative = formatRelative(new Date(story.updated_at), now);
    return relative;
  }, [story.updated_at]);

  return (
    <Paper className={classes.paper}>
      <Box className={classes.title}>
        <Typography className="d-flex" variant="h6" component="h3" color="inherit">
          <Box className="centered" mr={2} component="span">
            {story.icon?.url ? (<InlineSdkImg className="centered" src={story.icon?.url} />)
              : story.topic?.icon?.url ? (<InlineSdkImg className="centered" src={story.topic?.icon?.url} />)
              : null}
          </Box>
          <Box className="centered" component="span">
            <MaybeLink href={story.source} color="inherit">
              {story.title}
            </MaybeLink>
          </Box>
        </Typography>
      </Box>


      <Box className={classes.subtitle}>
        <Typography variant="body2" component="p" color="secondary">
          {`Updated ${updated}`}
        </Typography>
      </Box>

      <Box className={classes.content}>
        <Typography variant="body2" component="p" color="inherit">
          {story.description}
        </Typography>
      </Box>
    </Paper>
  );
}