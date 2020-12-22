import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackagePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Access NpmsPackage's
   *
   * @param arg
   */
  canAccess(): boolean {

    // is NpmsPackage Admin|Viewer
    return this.ctx.hasPermission(
      Permission.NpmsPackages.Admin,
      Permission.NpmsPackages.Viewer,
    );
  }


  /**
   * Can the Requester Show NpmsPackage's
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is NpmsPackage Admin|Viewer
    return this.ctx.hasPermission(
      Permission.NpmsPackages.Admin,
      Permission.NpmsPackages.Viewer,
    );
  }


  /**
   * Can the Requester Show this NpmsPackage
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // is NpmsPackage Admin|Viewer
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Viewer,
    );
  }


  /**
   * Can the Requester Create NpmsPackage's
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is Admin, Manager or Creator
    return this.ctx.hasPermission(
      Permission.NpmsPackages.Admin,
      Permission.NpmsPackages.Creator,
    );
  }


  /**
   * Can the Requester SoftDelete the NpmsPackage?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is NpmsPackageAdmin
    return this.ctx.hasPermission(Permission.NpmsPackages.Admin);
  }


  /**
   * Can the Requester HardDelete the NpmsPackage?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is NpmsPackageAdmin
    return this.ctx.hasPermission(Permission.NpmsPackages.Admin);
  }



  /**
   * Can the Requester Restore the NpmsPackage?
   *
   * @param arg
   */
  canRestore(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // must be SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is NpmsPackageAdmin
    return this.ctx.hasPermission(Permission.NpmsPackages.Admin);
  }
}