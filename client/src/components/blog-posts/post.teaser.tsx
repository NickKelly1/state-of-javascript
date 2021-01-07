import React from "react";
import {
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { OrNullable } from "../../types/or-nullable.type";


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));


export interface IPostTeaserData {
  id: string | number;
  title: string;
  image: OrNullable<string>;
  teaser: string;
  body: string;
  author_name: OrNullable<string>;
  status_name: OrNullable<string>;
}

export interface IPostTeaserProps {
  post: IPostTeaserData;
}

export const PostTeaser = WithApi<IPostTeaserProps>((props) => {
  const { post, } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h1">
            {post.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div dangerouslySetInnerHTML={{ __html: post.teaser }} />
        </Grid>
      </Grid>
    </Paper>
  );
})