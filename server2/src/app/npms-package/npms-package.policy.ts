import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackagePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Can the Requester Show NpmsPackage's
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    // is Admin, Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.Show,
    ]);
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

    // is Admin, Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.Show,
    ]);
  }


  /**
   * Can the Requester Create NpmsPackage's
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {

    // is Admin, Manager or Creator
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.Create,
    ]);
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Admin, Manager or SoftDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.SoftDelete,
    ]);
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

    // is Admin, Manager or HardDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.HardDelete,
    ]);
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

    // is not SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is Admin, Manager or Restorer
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsPackages.Manage,
      Permission.NpmsPackages.Restore,
    ]);
  }
}