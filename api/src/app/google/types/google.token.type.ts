import * as TS from 'io-ts';

// token
export const TGoogleToken = TS.type({
  access_token: TS.string,
  refresh_token: TS.string,
  scope: TS.string,
  token_type: TS.string,
  expiry_date: TS.number,
})
export type TGoogleToken = TS.TypeOf<typeof TGoogleToken>