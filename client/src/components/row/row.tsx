import React, { CSSProperties, PropsWithChildren } from 'react';
import { AFlexArrangementType, Flex } from '../flex/flex';

export interface IRowProps {
  className?: string;
  style?: CSSProperties;
  align?: AFlexArrangementType;
  justify?: AFlexArrangementType;
}

export function Row(props: PropsWithChildren<IRowProps>): JSX.Element {
  return <Flex dir="row" {...props} />
}
