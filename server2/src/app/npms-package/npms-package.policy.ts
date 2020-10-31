import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackagePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsRecords,
      Permission.ShowNpmsRecord,
    ]);
  }

  canFindOne(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsRecords,
      Permission.ShowNpmsRecord,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsRecords,
      Permission.CreateNpmsRecord,
    ]);
  }

  canDelete(arg: {
    model: NpmsPackageModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsRecords,
      Permission.DeleteNpmsRecord,
    ]);
  }
}