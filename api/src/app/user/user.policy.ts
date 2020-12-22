import { UserModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { ist } from "../../common/helpers/ist.helper";
import { Permission } from "../permission/permission.const";

export class UserPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester Access Users?
   *
   * @param arg
   */
  canAccess(): boolean {

    // is UserAdmin, or UserManager, or UserViewer
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
      Permission.Users.Viewer,
    );
  }


  /**
   * Can the Requester FindMany Users?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is UserAdmin, or UserManager, or UserViewer
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
      Permission.Users.Viewer,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is UserAdmin, or UserManager, or UserViewer
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
      Permission.Users.Viewer,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is me and UserViewer
    if (this.ctx.isMe(model)
      && this.ctx.hasPermission(Permission.Users.Viewer)
    ) {
      return true;
    }

    // is UserAdmin or IdentitiyViewer
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.ViewIdentities,
    );
  }


  /**
   * Can the Requester Create users?
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is me & can Update Self
    if (this.ctx.isMe(model)
      && this.ctx.hasPermission(Permission.Users.UpdateSelf)
    ) {
      return true;
    }

    // is UserAdmin or UserManager
    return this.ctx.hasPermission([
      Permission.Users.Admin,
      Permission.Users.Manager,
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

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Users.Admin,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is UserAdmin
    return this.ctx.hasPermission(
      Permission.Users.Admin,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // must be SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // can on Admin user if Requester is SuperAdmin
    if (model.isAdmin() && this.ctx.isSuperAdmin()) return true;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is me & can UpdateSelf
    if (this.ctx.isMe(model)
      && this.ctx.hasPermission(Permission.Users.UpdateSelf)
    ) {
      return true;
    }

    // is UserAdmin or UserPasswordUpdater
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.UpdatePasswords,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin user
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is UserAdmin or UserDeactivator
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Deactivate,
    );
  }


  /**
   * Can the Requester Update the Email of the User (without requesting & accepting an EmailChangeVerificationEmail)?
   *
   * @param arg
   */
  canForceUpdateEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // can on Admin user if Requester is SuperAdmin
    if (model.isAdmin() && this.ctx.isSuperAdmin()) return true;

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is UserAdmin or UserForceUpdateEmails
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.ForceUpdateEmails,
    );
  }


  /**
   * Can the Requester Verify the User (without requesting & accepting an UserVerificationEmail)?
   *
   * @param arg
   */
  canForceVerify(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // is UserAdmin or UserForceVerifier
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.ForceVerify,
    );
  }
}
