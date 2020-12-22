import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { UserTokenTypeModel } from "./user-token-type.model";

export class UserLinkTypePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester FindMany UserTokensTypes?
   */
  canFindMany(): boolean {

    // has UserTokenTypeViewer
    return this.ctx.auth.hasPermission(Permission.UserTokenTypes.Viewer);
  }

  /**
   * Can the Requester Find this UserTokenType?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: UserTokenTypeModel;
  }): boolean {
    const { model } = arg;

    // has UserTokenTypeViewer
    return this.ctx.auth.hasPermission(Permission.UserTokenTypes.Viewer);
  }
}