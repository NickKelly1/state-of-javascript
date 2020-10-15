import { makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { PublicEnvContext } from '../../contexts/public-env.context';
import { IInlineImgProps, InlineImg } from '../inline-img/inline-img';

export type IInlineCmsImgProps = IInlineImgProps;

export function InlineCmsImg(props: IInlineCmsImgProps) {
  const { src } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  return (
    <InlineImg {...props} src={`${publicEnv.API_URL}${src}`} />
  );
}
