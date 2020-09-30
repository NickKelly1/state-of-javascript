import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { OrNullable } from '../../types/or-nullable.type';
import { OrString } from '../../types/or-string.type';
import { InlineSdkImg } from '../inline-sdk-img/inline-sdk-img';
import { MaybeLink } from '../maybe-link/maybe-link';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: 'space-between',
  },
  title: {
    //
  },
  category: {
    //
  },
}));

interface IInfoCardHeaderProps {
  children: OrString<ReactNode>;
}

export function InfoCardHeader(props: IInfoCardHeaderProps) {
  const { children } = props;
  const classes = useStyles();
  //
  return (
    <Box className={classes.root}>
      {children}
    </Box>
  );
}