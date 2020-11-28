
// shadow_id:
//  - Random id in LocalStorage (& set in cookies) to carry on the users session if they don't have an account
//  - Required to allow users to do simple things like create npms dashboards
//  - Trivial to spoof somebodies shadow identity, so NOTHING confidential
//    should be attached to it. Once logged in, shadow_id must be removed...
// aliased as shad_id because "shadow_id" sounds worse
export type shad_id = 'shad_id';
export const shad_id: shad_id = 'shad_id';