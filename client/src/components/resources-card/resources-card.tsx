import { Grid, Link, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { Fragment, useContext } from "react";
import { PublicEnvContext } from "../../contexts/public-env.context";
import { ResourceSdkResource } from "../../sdk/types/resource.sdk.resource";
import { InlineImg } from "../inline-img/inline-img";
import { InlineSdkImg } from "../inline-img/inline-sdk-img";
import { MaybeLink } from "../maybe-link/maybe-link";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

interface IResourceCardProps {
  resources: ResourceSdkResource[];
}

export function ResourcesCard(props: IResourceCardProps) {
  const { resources } = props;
  const { publicEnv } = useContext(PublicEnvContext);

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      {/* Resources */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" color="primary">
            Resources
          </Typography>
        </Grid>
        {resources.map((resource, i) => (
          <Fragment key={i}>
            <Grid className="centered" item xs={1}>
              {resource.logo?.url && (
                <InlineSdkImg src={resource.logo.url} />
              )}
            </Grid>
            <Grid item key={i} xs={11}>
              <Typography variant="body2" component="p" color="inherit">
                <MaybeLink href={resource.link} color="inherit">
                  {resource.description}
                </MaybeLink>
              </Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Paper>
  );
}