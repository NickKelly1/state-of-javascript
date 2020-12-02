import { IntegrationModel, } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class IntegrationPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Can Find many?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Viewer,
    ]);
  }


  /**
   * Can Find one?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: IntegrationModel;
  }): boolean {
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Viewer,
    ]);
  }


  /**
   * Can show encrypted data
   */
  canShowSecrets(): boolean {
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.ViewSecrets,
    ]);
  }


  /**
   * Can show encrypted data of a model
   *
   * @param arg
   */
  canShowSecretsOf(arg: {
    model: IntegrationModel;
    //
  }): boolean {
    return this.canShowSecrets();
  }


  /**
   * Can initialise integrations?
   */
  canInititialise(): boolean {
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Manage,
    ]);
  }


  /**
   * Can initialise this specific integration?
   *
   * @param arg
   */
  canInititialiseOne(arg: {
    model: IntegrationModel
  }): boolean {
    return this.canInititialise();
  }
}