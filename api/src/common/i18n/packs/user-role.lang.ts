import { RoleId } from "../../../app/role/role.id.type";
import { RoleModel } from "../../../app/role/role.model";
import { UserId } from "../../../app/user/user.id.type";
import { UserModel } from "../../../app/user/user.model";
import { Language } from "../consts/language.enum";

export const UserRoleLang = {
  AlreadyExists: (arg: { user: string | number, role: string | number }) => ({
    [Language.En]: `user "${arg.user}" already has role "${arg.role}"`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create user role',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update user role',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'user role not found',
    [Language.Ger]: '__TODO__',
  },
};