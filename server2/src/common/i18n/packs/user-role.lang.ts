import { RoleModel } from "../../../app/role/role.model";
import { UserModel } from "../../../app/user/user.model";
import { Language } from "../consts/language.enum";

export const UserRoleLang = {
  AlreadyExists: (arg: { user: UserModel, role: RoleModel }) => ({
    [Language.En]: `user "${arg.user.name}" already has role "${arg.role.name}"`,
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