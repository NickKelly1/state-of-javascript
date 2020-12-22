import { IntegrationModel, } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class IntegrationPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can Access?
   *
   * @param arg
   */
  canAccess(): boolean {
    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Viewer,
    ]);
  }


  /**
   * Can FindMany?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Viewer,
    ]);
  }


  /**
   * Can FindOne?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: IntegrationModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    return this.ctx.auth.hasPermission([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Integrations.Viewer,
    ]);
  }


  /**
   * Can show encrypted data
   */
  canShowSecrets(): boolean {

    // can access
    if (!this.canAccess()) return false;

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
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    return this.canShowSecrets();
  }


  /**
   * Can initialise integrations?
   */
  canInititialise(): boolean {

    // can access
    if (!this.canAccess()) return false;

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
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    return this.canInititialise();
  }
}