import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { UserTokenTypeModel } from "../user-token-type/user-token-type.model";

export class UserTokenPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Can the Requester find UserTokens?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can View UserTokens
    return this.ctx.hasPermission(Permission.UserTokens.Viewer);
  }

  /**
   * Can the Requester find this UserToken?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: UserTokenTypeModel;
  }): boolean {
    const { model } = arg;

    // TODO: harder authentication?

    // can Show UserTokens
    return this.ctx.hasPermission(Permission.UserTokens.Viewer);
  }
}