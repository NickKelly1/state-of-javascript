import React from 'react';
import { Attempt } from '../../../helpers/attempted.helper';
import { NormalisedError } from '../../../helpers/normalise-error.helper';
import { NpmsPackageInfos } from '../../../npms-api/types/npms-package-info.type';


export interface IWssDashboardsProps {
  packages: NpmsPackageInfos;
}

export function WssDashboardProps() {
  //
}