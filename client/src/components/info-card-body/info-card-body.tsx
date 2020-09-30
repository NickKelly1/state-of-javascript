import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { OrString } from '../../types/or-string.type';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: theme.spacing(2),
  },
}));

interface IInfoCardBodyProps {
  children?: OrString<ReactNode>;
}

export function InfoCardBody(props: IInfoCardBodyProps) {
  const { children } = props;
  const classes = useStyles();
  return (
    <Box className={classes.content}>
        {children}
    </Box>
  )
}