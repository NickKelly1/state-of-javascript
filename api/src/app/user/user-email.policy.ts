import { UserModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { ist } from "../../common/helpers/ist.helper";
import { Permission } from "../permission/permission.const";

export class UserEmailPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester RequestWelcomeEmail for the User?
   *
   * @param arg
   */
  canRequestWelcomeEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // can AcceptWelcome
    if (!this.canConsumeWelcomeToken({ model })) return false;

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
  canConsumeWelcomeToken(arg: {
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
  canRequestEmailChangeEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // must allow ConsumeEmailChange
    if (!this.canConsumeEmailChangeToken({ model })) return false;

    // This is a dangerous action. If used on another account, you could switch
    // their email to yours. Therefore this is -only- allowed by Admin on arbitrary
    // accounts

    // can if is SuperAdmin
    if (this.ctx.isSuperAdmin()) {
      return true;
    }

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
  canConsumeEmailChangeToken(arg: {
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

    if (!this.canConsumeVerificationToken({ model })) return false;

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
  canConsumeVerificationToken(arg: {
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
   * Can the Requester trigger a RequestPasswordReset for the User?
   *
   * @param arg
   */
  canRequestPasswordResetEmail(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;

    // model can accept password reset
    if (!this.canConsumePasswordResetToken({ model })) return false;

    // no other requirements
    return true;
  }


  /**
   * Can the Requester Accept a RequestPasswordReset for the User?
   *
   * @param arg
   */
  canConsumePasswordResetToken(arg: {
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
