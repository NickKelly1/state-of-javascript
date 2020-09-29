import React, { Fragment } from 'react';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ssPropsHandler } from '../../src/helpers/ss-props-handler.helper';
import { Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { PublicEnv } from '../../src/env/public-env.helper';
import { StorySdkResource } from '../../src/sdk/types/story.sdk.resource';
import { ResourcesCard } from '../../src/components/resources-card/resources-card';
import { StoriesCard } from '../../src/components/stories-card/stories-card';
import { ResourceSdkResource } from '../../src/sdk/types/resource.sdk.resource';
import { StoryCard } from '../../src/components/story-card/story-card';

interface IHomeProps {
  resources: ResourceSdkResource[];
  stories: StorySdkResource[];
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  logo: {
    maxHeight: '1em',
  },
}));

function HomePage(props: IHomeProps) {
  const { resources, stories } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <section>
                  <Grid container spacing={2}>
                    {stories.map((story, i) => (
                      <Fragment key={i}>
                        <Grid item xs={12}>
                          <StoryCard story={story} />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </section>
              </Grid>
            </Grid>
          </section>
        </Grid>
        <Grid item xs={12}>
          <section>
            <ResourcesCard resources={resources} />
          </section>
        </Grid>
      </Grid>
    </>
  );
}


export const getServerSideProps = ssPropsHandler<IHomeProps>(async ({ ctx, sdk }) => {
  const [resources, stories] = await Promise.all([sdk.resources(), sdk.stories()]);
  return {
    props: {
      resources,
      stories,
    }
  }
})

export default HomePage;