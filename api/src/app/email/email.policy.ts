import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class EmailPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester send arbitrary Emails?
   */
  canSendEmail(): boolean {
    // only SuperAdmin can send arbitrary emails
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }
}
