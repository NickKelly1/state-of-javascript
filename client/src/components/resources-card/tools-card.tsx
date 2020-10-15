import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { ResourceCmsResource } from '../../cms/types/resource.cms.resource';
import { InfoCard } from '../info-card/info-card';
import { InlineCmsImg } from '../inline-cms-img/inline-cms-img';
import { MaybeLink } from '../maybe-link/maybe-link';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  header: {
    display: "flex",
    justifyContent: 'space-between',
  }
}));

interface IToolsCardProps {
  tools: ResourceCmsResource[];
}

export function ToolsCard(props: IToolsCardProps) {
  const { tools } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid className={classes.header} item xs={12}>
          <Typography component="h2" variant="h6" color="primary">
            Tools
          </Typography>
          <Typography component="h2" variant="h6" color="textSecondary">
            Tooling
          </Typography>
        </Grid>
        {tools.map((tool, i) => (
          <Fragment key={i}>
            <Grid className="centered" item xs={1}>
              {tool.icon?.url ? (<InlineCmsImg src={tool.icon.url} />)
              : tool.logo?.url ? (<InlineCmsImg src={tool.logo.url} />)
              : null}
            </Grid>
            <Grid item key={i} xs={11}>
              <Typography variant="body2" component="p" color="inherit">
                <MaybeLink href={tool.link} color="inherit">
                  {tool.description}
                </MaybeLink>
              </Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Paper>
  );
}