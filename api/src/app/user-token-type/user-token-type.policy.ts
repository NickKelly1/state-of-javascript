import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { UserTokenTypeModel } from "./user-token-type.model";

export class UserLinkTypePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
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