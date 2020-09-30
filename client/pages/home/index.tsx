import React, { Fragment } from 'react';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ssPropsHandler } from '../../src/helpers/ss-props-handler.helper';
import { Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { PublicEnv } from '../../src/env/public-env.helper';
import { ArticleSdkResource } from '../../src/sdk/types/article.sdk.resource';
import { ResourcesCard } from '../../src/components/resources-card/resources-card';
import { StoriesCard } from '../../src/components/stories-card/stories-card';
import { ResourceSdkResource } from '../../src/sdk/types/resource.sdk.resource';
import { ArticleCard } from '../../src/components/article-card/article-card';
import { SdkFilterEq, SdkFilterNIn, SdkQuery, SdkSort, SdkSortDir } from '../../src/sdk/sdk-query.type';
import { Sort } from '@material-ui/icons';
import { ToolsCard } from '../../src/components/resources-card/tools-card';
import { ToolCard } from '../../src/components/tool-card/tool-card';
import { SdkResourceCategory } from '../../src/sdk/sdk-resource-category.enum';

interface IHomeProps {
  resources: ResourceSdkResource[];
  stories: ArticleSdkResource[];
  tools: ResourceSdkResource[];
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  logo: {
    maxHeight: '1em',
  },
  category: {
    // border: '1px white solid',
    // borderRadius: '16px'
  }
}));

function HomePage(props: IHomeProps) {
  const { resources, tools, stories } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2}>
        {/* stories */}
        <Grid className={classes.category} item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  News
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <section>
                  <Grid container spacing={2}>
                    {stories.map((story, i) => (
                      <Fragment key={i}>
                        <Grid item xs={12} sm={12} lg={6}>
                          <ArticleCard article={story} />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </section>
              </Grid>
            </Grid>
          </section>
        </Grid>

        {/* stories */}
        <Grid item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Tooling
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <section>
                  <Grid container spacing={2}>
                    {tools.map((tool, i) => (
                      <Fragment key={i}>
                        <Grid item xs={12} sm={6} lg={4}>
                          <ToolCard tool={tool} />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </section>
              </Grid>
            </Grid>
          </section>
        </Grid>

        {/* <Grid item xs={12}>
          <section>
            <ToolsCard tools={tools} />
          </section>
        </Grid>

        <Grid item xs={12}>
          <section>
            <ResourcesCard resources={resources} />
          </section>
        </Grid> */}
      </Grid>
    </>
  );
}

export const getServerSideProps = ssPropsHandler<IHomeProps>(async ({ ctx, sdk }) => {
  const resourceQuery = SdkQuery.create();
  resourceQuery.addSort(SdkSort.create({ field: 'id', value: SdkSortDir.Desc }));
  resourceQuery.addFilter(SdkFilterNIn.create({ field: 'resource_category', values: [SdkResourceCategory.Tooling] }))
  resourceQuery.setLimit(10);
  resourceQuery.setSkip(0);
  const resourcesRequest = sdk.resources({ query: resourceQuery });

  const toolsQuery = SdkQuery.create();
  toolsQuery.addSort(SdkSort.create({ field: 'id', value: SdkSortDir.Desc }));
  toolsQuery.addFilter(SdkFilterEq.create({ field: 'resource_category', value: SdkResourceCategory.Tooling }))
  toolsQuery.setLimit(10);
  toolsQuery.setSkip(0);
  const toolsRequest = sdk.resources({ query: toolsQuery });

  const storiesQuery = SdkQuery.create();
  storiesQuery.addSort(SdkSort.create({ field: 'created_at', value: SdkSortDir.Desc }));
  storiesQuery.setLimit(10);
  storiesQuery.setSkip(0);
  const storiesRequest = sdk.stories({ query: storiesQuery });

  const [ resources, tools, stories, ] = await Promise.all([ resourcesRequest, toolsRequest, storiesRequest ]);

  return {
    props: {
      resources,
      stories,
      tools,
    }
  }
})

export default HomePage;