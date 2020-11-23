import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { OrNullable } from "../../types/or-nullable.type";

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
  className?: OrNullable<string>;
  message?: string;
}

export function NotFound(props: INotFoundProps) {
  const { message, className } = props;
  const classes = useStyles();

  return (
    <div className={clsx(className, classes.root)}>
      <Typography component="h2" variant="h2">
        {message ?? 'Not found'}
      </Typography>
    </div>
  )
}