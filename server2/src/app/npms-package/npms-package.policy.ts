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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.ShowNpmsPackages,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.ShowNpmsPackages,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.CreateNpmsPackages,
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
    if (model.isSoftDeleted()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.SoftDeleteNpmsPackages,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.HardDeleteNpmsPackages,
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
    if (!model.isSoftDeleted()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsPackages,
      Permission.RestoreNpmsPackages,
    ]);
  }
}