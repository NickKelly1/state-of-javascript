import { UserModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class UserPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  protected isProtectedUser(user: UserModel): boolean {
    return (user.isAdmin() || user.isAnonymous() || user.isSystem());
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.ShowUsers,
    ]);
  }

  canFindOne(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.ShowUsers,
    ]);
  }

  canShowIdentity(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // self
    if (this.ctx.auth.isMe(model) && this.ctx.auth.hasAnyPermissions([Permission.ShowUsers])) return true;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.ShowUserIdentities,
    ]);
  }

  canRegister(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.RegisterUsers,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.CreateUsers,
    ]);
  }

  canUpdate(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // self
    if (this.ctx.auth.isMe(model) && this.ctx.auth.hasAnyPermissions([Permission.UpdateUserSelf])) return true;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.UpdateUsers,
    ]);
  }

  canUpdatePassword(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // self
    if (this.ctx.auth.isMe(model) && this.ctx.auth.hasAnyPermissions([Permission.UpdateUserSelf])) return true;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.UpdateUserPasswords
    ]);
  }

  canDeactivate(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.DeactivateUsers,
    ]);
  }

  canSoftDelete(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // already deleted?
    if (model.isSoftDeleted()) return false;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // self
    if (this.ctx.auth.isMe(model) && this.ctx.auth.hasAnyPermissions([Permission.SoftDeleteUserSelf])) return true;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.SoftDeleteUsers,
    ]);
  }

  canHardDelete(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.HardDeleteUsers,
    ]);
  }

  canRestore(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    // not deleted?
    if (!model.isSoftDeleted()) return false;
    // protected?
    if (this.isProtectedUser(model)) return false;
    // other
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.RestoreNewsArticles,
    ]);
  }
}