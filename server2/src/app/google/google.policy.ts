import { IntegrationModel, } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class GooglePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Can OAuth2 with google?
   */
  canOAuth2(arg: { model: IntegrationModel }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Manage,
    ]);
  }


  /**
   * Can send gmails?
   */
  canSendGmail(arg: { model: IntegrationModel }): boolean {
    const { model } = arg;
    if (!model.isConnected()) return false;
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Manage,
    ]);
  }
}