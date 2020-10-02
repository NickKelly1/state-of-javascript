import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { OrNullable } from '../../types/or-nullable.type';
import { OrString } from '../../types/or-string.type';
import { InlineSdkImg } from '../inline-sdk-img/inline-sdk-img';
import { MaybeLink } from '../maybe-link/maybe-link';

const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));

interface IInfoCardCategoryProps {
  children: OrString<ReactNode>;
}

export function InfoCardCategory(props: IInfoCardCategoryProps) {
  const { children } = props;
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography component="p" variant="h6" color="textSecondary">
        {children}
      </Typography>
    </Box>
  );
}