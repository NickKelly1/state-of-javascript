import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { ImageModel } from "./image.model";

export class ImagePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Access Images?
   *
   * @param arg
   */
  canAccess(): boolean {

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Show Images?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Create Images?
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Show this Image?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: ImageModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Update this Image?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: ImageModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester SoftDelete this Image?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: ImageModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester HardDelete this Image?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: ImageModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Restore this Image?
   *
   * @param arg
   */
  canRestore(arg: {
    model: ImageModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }

}