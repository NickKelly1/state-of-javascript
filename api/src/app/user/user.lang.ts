import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { UserModel } from "./user.model";

export const UserLang = {
  CannotFindMany: {
    [Language.En]: `you cannot view users`,
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access users`,
    [Language.Ger]: '__TODO__',
  },


  NotFound: {
    [Language.En]: 'user not found',
    [Language.Ger]: '__TODO__',
  },

  // actions

  CannotCreate: {
    [Language.En]: `you cannot create users`,
    [Language.Ger]: '__TODO__',
  },

  CannotUpdate: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot update user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSoftDelete: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot restore user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotForceUpdateEmail: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot force-update-email of user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotChangeVerification: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot change-verification of user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotChangeActivation: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot change-activation of user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotUpdatePassword: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot update-password of user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRequestWelcomeEmail: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot request-welcome-email for user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  EmailTaken: (arg: { email: string }): LangSwitch => ({
    [Language.En]: `"${arg.email}" is in use`,
    [Language.Ger]: '__TODO__',
  }),

  AlreadyExists: (arg: { name: string }): LangSwitch => ({
    [Language.En]: `user "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenAddingRoles: (arg: { userName: string, roleNames: string[] }): LangSwitch => ({
    [Language.En]: `Forbidden: unable to add roles of user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenDeletingRoles: (arg: { userName: string, roleNames: string[] }): LangSwitch => ({
    [Language.En]: `Forbidden: unable to delete roles from user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),
};