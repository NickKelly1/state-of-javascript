import * as T from 'io-ts';

export const TUserTokenVerifyEmailChangeData = T.type({
  email: T.string,
});
export type TUserTokenVerifyEmailChangeData = T.TypeOf<typeof TUserTokenVerifyEmailChangeData>