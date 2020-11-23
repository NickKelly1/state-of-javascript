import * as TS from 'io-ts';
import { TGoogleCredentials } from './google.credentials.type';

// init
export const TGoogleInit = TS.type({
  credentials: TGoogleCredentials,
  scopes: TS.array(TS.string),
});
export type TGoogleInit = TS.TypeOf<typeof TGoogleInit>