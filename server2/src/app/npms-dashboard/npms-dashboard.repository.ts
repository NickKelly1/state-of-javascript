import { ModelCtor, Op, Order, OrderItem, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { ist } from "../../common/helpers/ist.helper";
import { orWhere } from "../../common/helpers/or-where.helper.ts";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { NpmsDashboardStatus } from "../npms-dashboard-status/npms-dashboard-status.const";
import { Permission } from "../permission/permission.const";
import { NpmsDashboardField } from "./npms-dashboard.attributes";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export class NpmsDashboardRepository extends BaseRepository<NpmsDashboardModel> {
  protected readonly Model = NpmsDashboardModel as ModelCtor<NpmsDashboardModel>;


  /**
   * @inheritdoc
   */
  order(): OrUndefined<Order> {
    return [
      [NpmsDashboardField.order, 'ASC'],
      [NpmsDashboardField.id, 'ASC'],
    ];
  }


  /**
   * @inheritdoc
   *
   * Logic equivalent to NpmsDashboardPolicy
   */
  scope(): OrUndefined<WhereOptions<NpmsDashboardModel['_attributes']>> {
    const shadow_id = this.ctx.auth.shadow_id;
    const user_id = this.ctx.auth.user_id;

    // let Admin, Manager and ShowAller see all
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.ShowAll,
    ])) {
      // Admin or Moderator: no filters...
      return undefined;
    }

    // must have NpmsDashboards.ShowSome
    if (!this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.ShowSome])) {
      return { [NpmsDashboardField.id]: { [Op.eq]: null }, };
    }

    // filter for Published or Ownership
    const where = orWhere([
      // is Published
      { [NpmsDashboardField.status_id]: { [Op.in]: [ NpmsDashboardStatus.Published, ] } },

      // or
      orWhere([

        // is Owner
        ist.defined(user_id) ? { [NpmsDashboardField.owner_id]: { [Op.eq]: user_id }, } : null,

        // or Shadow Owner
        ist.defined(shadow_id) ? { [NpmsDashboardField.shadow_id]: { [Op.eq]: shadow_id }, } : null,
      ]),
    ]);

    return where;
  }
}
