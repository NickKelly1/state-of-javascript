import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { UserTokenTypeModel } from "../user-token-type/user-token-type.model";

export class UserTokenPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserTokens.Show,
    ]);
  }

  canFindOne(arg: {
    model: UserTokenTypeModel;
  }): boolean {
    const { model } = arg;

    // TODO: heavier authorisation?...
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserTokens.Show,
    ]);
  }
}