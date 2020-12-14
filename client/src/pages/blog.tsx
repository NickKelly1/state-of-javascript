import { Grid, Typography } from "@material-ui/core";
import React from "react";

const Blog = () => {
  return (
    <div>
      <Grid container>
        <Grid className="centered" item xs={12}>
          <Typography variant="h1" component="h1"><a href="https://github.com/NickKelly1/example-gql-ts-accounts">Coming soon!</a></Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Blog;