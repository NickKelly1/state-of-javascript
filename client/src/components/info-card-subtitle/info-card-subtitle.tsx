import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { OrString } from '../../types/or-string.type';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}));

interface IInfoCardSubtitleProps {
  children: OrString<ReactNode>;
}

export function InfoCardSubtitle(props: IInfoCardSubtitleProps) {
  const { children } = props;
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {children}
    </Box>
  )
}