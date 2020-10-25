import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { serverSidePropsHandler } from "../helpers/server-side-props-handler.helper";
import { staticPathsHandler, staticPropsHandler } from "../helpers/static-props-handler.helper";

const useStyles = makeStyles((theme) => ({
  form: {
    //
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}));

export interface IFourZeroFourPageProps {
  //
}


function FourZeroFourPage(props: IFourZeroFourPageProps) {
  const classes = useStyles();
  //
  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3">
        {`404 page not found`}
      </Typography>
    </div>
  )
}

export default FourZeroFourPage;

export const getStaticProps = staticPropsHandler<IFourZeroFourPageProps>(async ({ ctx, cms, npmsApi }) => {
  return {
    props: {
      //
    },
    // revalidate: false,
  };
});


export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
  return {
    fallback: false,
    paths: [],
  };
})
