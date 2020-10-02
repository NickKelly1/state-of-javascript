import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { CSSProperties, ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

interface IInfoCardProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function InfoCard(props: IInfoCardProps) {
  const { className, style, children } = props;
  
  const classes = useStyles();

  return (
    <Paper style={style} className={clsx(className, classes.root)}>
      {children}
    </Paper>
  );
}