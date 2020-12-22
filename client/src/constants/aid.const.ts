
// aid: anonymous id
//  - Random id in LocalStorage (& set in cookies) to carry on the users session if they don't have an account
//  - Required to allow users to do simple things like create npms dashboards
//  - Trivial to spoof somebodies anonymous identity (todo: implement hashing on server to stop spoofing...)

export type _ls_aid_key = 'aid';
export const _ls_aid_key: _ls_aid_key = 'aid';

// headers can't have underscores

export type _header_aid_key = 'aid';
export const _header_aid_key: _header_aid_key = 'aid';

export type _cookie_aid_key = 'aid';
export const _cookie_aid_key: _cookie_aid_key = 'aid';
