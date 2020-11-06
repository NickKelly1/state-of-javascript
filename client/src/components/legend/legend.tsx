import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { FullscreenExitRounded } from '@material-ui/icons';
import React, { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import seedRandom from 'seed-random';
import { ring } from '../../helpers/ring.helper';
import { DebugModeContext } from '../../contexts/debug-mode.context';

const useStyles = makeStyles((theme) => ({
  root: {
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
  const debugMode = useContext(DebugModeContext);

  return (
    // <Box className={className} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <ul className={clsx(className, classes.root)}>
        {names.map((name, i) => (
          <li className={classes.legend_item} key={i}>
            <Box mr={2} className={classes.legend_item_colour} style={{ backgroundColor: ring(colours, i) }}/>
            <Box textAlign="left">
              {name}
            </Box>
          </li>
        ))}
      </ul>
    // </Box>
  );
}