import { FileModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { BlogPostModel } from "../blog-post/blog-post.model";
import { Permission } from "../permission/permission.const";

export class FilePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Access Files?
   *
   * @param arg
   */
  canAccess(): boolean {

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Show Files?
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
   * Can the Requester Create Files?
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
   * Can the Requester Show this File?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: FileModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Update this File?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: FileModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester SoftDelete this File?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: FileModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester HardDelete this File?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: FileModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Can the Requester Restore this File?
   *
   * @param arg
   */
  canRestore(arg: {
    model: FileModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be SuperAdmin
    return this.ctx.hasPermission(Permission.SuperAdmin.SuperAdmin);
  }

}