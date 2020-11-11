import { makeStyles } from "@material-ui/core";
import React from "react";
import { NotFound } from "../components/not-found/not-found";

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
  return (
    <div className={classes.root}>
      <NotFound message="404 page not found" />
    </div>
  )
}

export default FourZeroFourPage;
