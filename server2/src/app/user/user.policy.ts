import { UserModel } from "../../circle";
import { ist } from "../../common/helpers/ist.helper";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class UserPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Is the user a protected / system / migrated user?
   *
   * @param user
   */
  protected isProtectedUser(user: UserModel): boolean {
    return (user.isAdmin() || user.isAnonymous() || user.isSystem());
  }


  /**
   * Can the Requester FindMany Users?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.ShowUsers,
    ]);
  }


  /**
   * Can the Requester Show this user?
   *
   * @param arg
   */
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


  /**
   * Can the Requester Show identifying User information (like email)?
   *
   * @param arg
   */
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


  /**
   * Can the Requester Register Users?
   *
   * @param arg
   */
  canRegister(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.RegisterUsers,
    ]);
  }


  /**
   * Can the Requester Create users?
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
      Permission.CreateUsers,
    ]);
  }


  /**
   * Can the requester Update the User?
   *
   * @param arg
   */
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


  /**
   * Can the Requester Update the Users Password?
   *
   * @param arg
   */
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


  /**
   * Can the Requester Deactivate the user?
   *
   * @param arg
   */
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


  /**
   * Can the Requester SoftDelete the User?
   *
   * @param arg
   */
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


  /**
   * Can the Requester HardDelete the User?
   *
   * @param arg
   */
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


  /**
   * Can the requester restore the user?
   *
   * @param arg
   */
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


  /**
   * Can the Requester RequestWelcome for the User?
   *
   * @param arg
   */
  canRequestWelcome(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    if (!this.canAcceptWelcome({ model })) return false;

    // is UserManager or SuperAdmin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
    ]);
  }


  /**
   * Can the user be Welcomed to the app? (required for user/email verification...)
   *
   * @param arg
   */
  canAcceptWelcome(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is not deactivated
    if (model.isDeactivated()) return false;

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    return true;
  }


  /**
   * Can the Requester send a EmailChangeRequest to the User? (required for user/email verification...)
   *
   * @param arg
   */
  canRequestEmailChange(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    if (!this.canConsumeEmailChange({ model })) return false;

    // is UserManager or SuperAdmin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
    ]);
  }


  /**
   * Can the Requester consume a EmailChangeRequest? (required for user/email verification...)
   *
   * @param arg
   */
  canConsumeEmailChange(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is not deactivated
    if (model.isDeactivated()) return false;

    // Admin can RequestEmailChange
    // if (model.isAdmin()) return false;

    // is not System User
    if (model.isSystem()) return false;

    // is not Anonymous User
    if (model.isAnonymous()) return false;

    // is Me
    if (this.ctx.auth.isMe(model)) return true;

    return true;
  }


  /**
   * Can the Requester trigger a VerificationEmail for the User?
   *
   * @param arg
   */
  canRequestVerificationEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    if (!this.canConsumeVerificationEmail({ model })) return false;

    // is UserManager or SuperAdmin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
    ]);
  }


  /**
   * Can the Requester consume a VerificationEmail?
   *
   * @param arg
   */
  canConsumeVerificationEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // has an Email
    if (ist.nullable(model.email)) return false;

    // is not already Verified
    if (!model.isVerified()) return false;

    // is not Deactivated
    if (model.isDeactivated()) return false;

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is Me
    if (this.ctx.auth.isMe(model)) return true;

    return true;
  }


  /**
   * Can the Requester trigger a RequestForgottenPasswordReset for the User?
   *
   * @param arg
   */
  canRequestForgottenPasswordReset(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    if (!this.canAcceptForgottenPasswordReset({ model })) return false;

    // is Manager or Admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUsers,
    ]);
  }


  /**
   * Can the Requester Accept a RequestForgottenPasswordReset for the User?
   *
   * @param arg
   */
  canAcceptForgottenPasswordReset(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // has an Email
    if (ist.nullable(model.email)) return false;

    // is not Deactivated
    if (model.isDeactivated()) return false;

    // is not Admin
    if (model.isAdmin()) return false;

    // is not the SystemUser
    if (model.isSystem()) return false;

    // is not the AnonymousUser
    if (model.isAnonymous()) return false;

    // is Me
    if (this.ctx.auth.isMe(model)) return true;

    return true;
  }
}
