import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { FullscreenExitRounded } from '@material-ui/icons';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import seedRandom from 'seed-random';
import { ring } from '../../helpers/ring.helper';

const useStyles = makeStyles((theme) => ({
  legend: {
    paddingLeft: '0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  legend_item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend_item_colour: {
    width: '1em',
    height: '1em',
    border: '1px solid',
    borderColor: theme.palette.grey[500],
  }
}));


export interface ILegendProps {
  names: string[];
  colours: string[];
  className?: string;
}

export function Legend(props: ILegendProps) {
  const { colours, names, className, } = props;
  const classes = useStyles();
  return (
    <ul className={clsx(className, classes.legend)}>
      {names.map((name, i) => (
        <li className={classes.legend_item} key={i}>
          <Box mr={2} className={classes.legend_item_colour} style={{ backgroundColor: ring(colours, i) }}/>
          <span>
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}