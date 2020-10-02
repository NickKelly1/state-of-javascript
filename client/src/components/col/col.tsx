import React, { CSSProperties, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { AFlexArrangementType, Flex } from '../flex/flex';

export interface IColProps {
  className?: string;
  style?: CSSProperties;
  align?: AFlexArrangementType;
  justify?: AFlexArrangementType;
}

export function Col(props: PropsWithChildren<IColProps>): JSX.Element {
  return <Flex dir="col" {...props} />;
}
