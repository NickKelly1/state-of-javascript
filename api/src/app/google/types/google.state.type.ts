import * as TS from 'io-ts';
import { TGoogleToken } from "./google.token.type";

// state
export const TGoogleState = TS.type({
  token: TGoogleToken,
});
export type TGoogleState = TS.TypeOf<typeof TGoogleState>
