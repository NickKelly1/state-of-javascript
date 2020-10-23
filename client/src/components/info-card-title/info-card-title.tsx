import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { OrNullable } from '../../types/or-nullable.type';
import { OrString } from '../../types/or-string.type';
import { InlineCmsImg } from '../inline-cms-img/inline-cms-img';
import { MaybeLink } from '../maybe-link/maybe-link';

const useStyles = makeStyles((theme) => ({
  centered: {
    //
  },
}));

interface IInfoCardTitleProps {
  title: OrString<ReactNode>;
  link?: OrNullable<string>;
  icon?: OrNullable<string>;
}

export function InfoCardTitle(props: IInfoCardTitleProps) {
  const { title, link, icon } = props;
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography className="d-flex" variant="h6" component="h3" color="inherit">
        <Box className="centered" mr={2} component="span">
          {icon && (<InlineCmsImg className="centered" src={icon} />)}
        </Box>
        <Box className="centered" component="span">
          <MaybeLink href={link} color="inherit">
            {title}
          </MaybeLink>
        </Box>
      </Typography>
    </Box>
  );
}