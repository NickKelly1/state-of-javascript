import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { OrNullable } from '../../types/or-nullable.type';

const useStyles = makeStyles((theme) => ({
  img: {
    maxHeight: '1em',
  },
}));


export interface IInlineImgProps {
  className?: OrNullable<string>,
  src: string;
}

export function InlineImg(props: IInlineImgProps) {
  const { src, className } = props;
  const classes = useStyles();
  return (
    <img className={clsx(className, classes.img)} src={src}></img>
  );
}
