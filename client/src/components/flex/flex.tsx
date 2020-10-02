import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { CSSProperties, PropsWithChildren, useMemo } from 'react';

export const FlexDirectionType = {
  row: 'row',
  col: 'col',
} as const;
export type FlexDirectionType = typeof FlexDirectionType;
export type AFlexDirectionType = FlexDirectionType[keyof FlexDirectionType];

export const FlexArrangementType = {
  center: 'center',
  start: 'start',
  end: 'end',
  between: 'between',
  around: 'around',
} as const;
export type FlexArrangementType = typeof FlexArrangementType;
export type AFlexArrangementType = FlexArrangementType[keyof FlexArrangementType];


const useStyles = makeStyles((theme) => ({
  dir_row: { flexDirection: 'row', },
  dir_col: { flexDirection: 'column', },

  justify_center: { justifyContent: 'center' },
  justify_start: { justifyContent: 'flex-start' },
  justify_end: { justifyContent: 'flex-end' },
  justify_between: { justifyContent: 'space-between' },
  justify_around: { justifyContent: 'space-around' },

  align_center: { alignItems: 'center', },
  align_start: { alignItems: 'flex-start', },
  align_end: { alignItems: 'flex-end', },
  align_between: { alignItems: 'space-between' },
  align_around: { alignItems: 'space-around' },
}));

export interface IFlexProps {
  className?: string;
  style?: CSSProperties;
  dir?: AFlexDirectionType;
  align?: AFlexArrangementType;
  justify?: AFlexArrangementType;
}

export function Flex(props: PropsWithChildren<IFlexProps>): JSX.Element {
  const { align, children, justify, dir, style, className } = props;
  const classes = useStyles();

  const dirClass =
    dir === FlexDirectionType.row ? classes.dir_row
    : dir === FlexDirectionType.col ? classes.dir_col
    : classes.dir_row

  const justifyClass =
    justify === FlexArrangementType.around ? classes.justify_around
    : justify === FlexArrangementType.between ? classes.justify_between
    : justify === FlexArrangementType.center ? classes.justify_center
    : justify === FlexArrangementType.end ? classes.justify_end
    : justify === FlexArrangementType.start ? classes.justify_start
    : classes.justify_center

  const alignClass =
    align === FlexArrangementType.around ? classes.align_around
    : align === FlexArrangementType.between ? classes.align_between
    : align === FlexArrangementType.center ? classes.align_center
    : align === FlexArrangementType.end ? classes.align_end
    : align === FlexArrangementType.start ? classes.align_start
    : classes.align_center

  return (
    <div style={style} className={clsx(className, dirClass, justifyClass, alignClass)}>
      {children}
    </div>
  );
}