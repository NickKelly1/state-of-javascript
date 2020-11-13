import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}));

export interface INotFoundProps {
  message: string;
}

export function NotFound(props: INotFoundProps) {
  const { message } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h2">
        {message}
      </Typography>
    </div>
  )
}