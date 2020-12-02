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
   * Can the Requester FindMany Users?
   *
   * @param arg
   */
  canFindMany(): boolean {

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

    // is me and UserViewer
    if (
      this.ctx.isMe(model)
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
   * Can the Requester Register?
   *
   * @param arg
   */
  canRegister(arg?: {
    //
  }): boolean {

    // is UserAdmin or UserRegisterer
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Register,
    );
  }


  /**
   * Can the Requester Login?
   *
   * @param arg
   */
  canLogin(): boolean {

    // LogIn is required otherwise Admin can't log in to change it
    return true;
  }


  /**
   * Can the Requester Logout?
   *
   * @TODO: put this in an auth policy
   *
   * @param arg
   */
  canLogout() {
    // Can LogOut if LoggedIn
    return this.ctx.auth.isLoggedIn();
  }


  /**
   * Can the Requester Login as a User?
   *
   * @param arg
   */
  canLoginAs(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // must be able to log in as anyone
    if (!this.canLogin()) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is not Deactivated
    if (model.isDeactivated()) return false;

    return true;
  }



  /**
   * Can the Requester Create users?
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {

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
  }) {
    const { model } = arg;

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
  }) {
    const { model } = arg;

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



  /**
   * Can the Requester RequestWelcome for the User?
   *
   * @param arg
   */
  canRequestWelcome(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // can AcceptWelcome
    if (!this.canAcceptWelcome({ model })) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is not deactivated
    if (model.isDeactivated()) return false;

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

    // must allow ConsumeEmailChange
    if (!this.canConsumeEmailChangeVerificationEmail({ model })) return false;

    // This is a dangerous action. If used on another account, you could switch
    // their email to yours. Therefore this is -only- allowed by Admin on arbitrary
    // accounts

    // can if is SuperAdmin
    if (this.ctx.isSuperAdmin()) {
      return true;
    };

    // can on self
    if (this.ctx.isMe(model)) {
      return true;
    }

    // fail
    return false;
  }


  /**
   * Can the Requester consume a EmailChangeRequest? (required for user/email verification...)
   *
   * @param arg
   */
  canConsumeEmailChangeVerificationEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // Admin can RequestEmailChange
    // if (model.isAdmin()) return false;

    // is not System User
    if (model.isSystem()) return false;

    // is not Anonymous User
    if (model.isAnonymous()) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is not deactivated
    if (model.isDeactivated()) return false;

    // is Me
    if (this.ctx.isMe(model)) return true;

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
    return this.ctx.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Users.Admin,
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

    // is not the Admin User
    if (model.isAdmin()) return false;

    // is not the System User
    if (model.isSystem()) return false;

    // is not the Anonymous User
    if (model.isAnonymous()) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // has an Email
    if (ist.nullable(model.email)) return false;

    // is not already Verified
    if (model.isVerified()) return false;

    // is not Deactivated
    if (model.isDeactivated()) return false;

    // is Me
    if (this.ctx.isMe(model)) return true;

    // no other requirements
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

    // model can accept password reset
    if (!this.canAcceptForgottenPasswordReset({ model })) return false;

    // no other requirements
    return true;
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

    // must not be SoftDeleted
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
    if (this.ctx.isMe(model)) return true;

    return true;
  }
}
