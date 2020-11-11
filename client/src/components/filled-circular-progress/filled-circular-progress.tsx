import React from 'react';
import { CircularProgress, CircularProgressProps, makeStyles } from "@material-ui/core";

interface IFilledCircularProgressProps extends CircularProgressProps {
  active: boolean;
}

export function FilledCircularProgress(props: IFilledCircularProgressProps) {
  const { active, ...circularProps } = props;

  // default size is 40 (px)
  const size = (circularProps.size || 40);

  // fill out the area even when not active
  return (
    <span style={{ minHeight: size }}>
      {active && <CircularProgress {...circularProps} />}
    </span>
  );
}