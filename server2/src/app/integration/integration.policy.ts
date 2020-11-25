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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ShowIntegrations,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ShowIntegrations,
    ]);
  }


  /**
   * Can show encrypted data
   */
  canShowSecrets(): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ShowIntegrationSecrets,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageIntegrations,
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