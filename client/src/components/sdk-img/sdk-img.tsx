import { makeStyles } from '@material-ui/core';
import React, { CSSProperties, useContext } from 'react';
import { PublicEnvContext } from '../../contexts/public-env.context';
import { OrNull } from '../../types/or-null.type';
import { OrNullable } from '../../types/or-nullable.type';
import { IInlineImgProps, InlineImg } from '../inline-img/inline-img';

export interface ISdkImgProps {
  src: string;
  className?: OrNullable<string>;
  style?: CSSProperties;
};

export function SdkImg(props: ISdkImgProps) {
  const { src, style, className } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  return (
    <img style={style} className={className ?? undefined} src={`${publicEnv.API_URL}${src}`} />
  );
}
