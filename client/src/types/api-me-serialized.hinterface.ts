import { IMeUserData } from '../backend-api/api.me';
import { AuthorisedActionsFieldsFragment } from '../generated/graphql';
import { OrNull } from './or-null.type';

export interface IApiMeSerialized {
  ss: boolean;
  user: OrNull<IMeUserData>;
  permissions: number[];
  can: OrNull<AuthorisedActionsFieldsFragment>;
}