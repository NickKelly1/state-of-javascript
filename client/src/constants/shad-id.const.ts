
// shadow_id:
//  - Random id in LocalStorage (& set in cookies) to carry on the users session if they don't have an account
//  - Required to allow users to do simple things like create npms dashboards
//  - Trivial to spoof somebodies shadow identity (todo: implement hashing on server to stop spoofing...)

export type _ls_shad_id_key = 'lshad_id';
export const _ls_shad_id_key: _ls_shad_id_key = 'lshad_id';

// headers can't have underscores

export type _header_shad_id_key = 'shad-id';
export const _header_shad_id_key: _header_shad_id_key = 'shad-id';

export type _cookie_shad_id_key = 'shad-id';
export const _cookie_shad_id_key: _cookie_shad_id_key = 'shad-id';