import { AuthorisedActionsFieldsFragment } from '../generated/graphql';

export interface IApiMeSerialized {
  instance: number;
  createdAt: number;
  user: null | { id: number; name: string; };
  permissions: number[];
  can: AuthorisedActionsFieldsFragment;
}