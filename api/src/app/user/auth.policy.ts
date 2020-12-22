import { UserModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class AuthPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester Register?
   *
   * @param arg
   */
  canRegister(): boolean {

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
  canLogout(): boolean {

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
}
