import { IMeUserData } from '../backend-api/api.me';
import { AuthorisedActionsFieldsFragment } from '../generated/graphql';

export interface IApiMeSerialized {
  instance: number;
  createdAt: number;
  user: null | IMeUserData;
  permissions: number[];
  can: AuthorisedActionsFieldsFragment;
}