import { Language, } from '../../common/i18n/consts/language.enum';
import { LangSwitch } from '../../common/i18n/helpers/lange-match.helper';
import { RoleId } from './role.id.type';
import { RoleModel } from './role.model';

export const RoleLang = {
  CannotFindMany: {
    [Language.En]: 'you cannot view roles',
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: 'you cannot access roles',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'role not found',
    [Language.Ger]: '__TODO__',
  },

  // actions

  CannotCreate: {
    [Language.En]: 'you cannot create roles',
    [Language.Ger]: '__TODO__',
  },

  CannotUpdate: (arg: { role: RoleModel }): LangSwitch => ({
    [Language.En]: `you cannot update ${arg.role.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSoftDelete: (arg: { role: RoleModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete ${arg.role.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { role: RoleModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete ${arg.role.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { role: RoleModel }): LangSwitch => ({
    [Language.En]: `you cannot restore ${arg.role.name}`,
    [Language.Ger]: '__TODO__',
  }),


  //

  AlreadyExists: (arg: { name: string }): LangSwitch => ({
    [Language.En]: `role "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenAddingPermissions: (arg: { roleName: string, permisionNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to add permissions of role "${arg.roleName}": "${arg.permisionNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenDeletingPermissions: (arg: { roleName: string, permisionNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to delete permissions from role "${arg.roleName}": "${arg.permisionNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create role',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update role',
    [Language.Ger]: '__TODO__',
  },

  IdsNotFound: (arg: { ids?: RoleId[] }): LangSwitch => {
    const { ids } = arg;
    if (!ids?.length) {
      return {
        [Language.En]: 'role not found',
        [Language.Ger]: '__TODO__',
      }
    }
    return {
      [Language.En]: `roles "${ids.join('", "')}" not found`,
      [Language.Ger]: '__TODO__',
    }
  },
};