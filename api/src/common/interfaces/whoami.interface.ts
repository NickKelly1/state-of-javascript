import { UserId } from '../../app/user/user.id.type';
import { OrNull } from '../types/or-null.type';

/**
 * Serializable
 */
export interface IWhoami {
  aid: OrNull<string>;
  user_id: OrNull<UserId>;
}
