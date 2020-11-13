import { UserModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { Combinator } from '../../common/helpers/combinator.helper';
import { ist } from '../../common/helpers/ist.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { RoleModel } from '../role/role.model';
import { UserRoleModel } from '../user-role/user-role.model';
import { ICreateUserDto } from './dtos/create-user.dto';
import { IUpdateUserDto } from './dtos/update-user.dto';
import { IUserRo } from './dtos/user.ro';
import { UserField } from './user.attributes';

export class UserService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Find unexpected or missing UserRoles & Roles
   *
   * @param arg
   */
  diffUserRoles(arg: {
    current: UserRoleModel[];
    desired: RoleModel[];
  }): {
    missing: RoleModel[];
    unexpected: UserRoleModel[];
    normal: UserRoleModel[];
  } {
    const { current, desired } = arg;
    const combinator = new Combinator({
      // a => previous
      a: new Map(current.map(userRole => [userRole.role_id, userRole])),
      // b => next
      b: new Map(desired.map(role => [role.id, role])),
    });
    // in previous but not next
    const unexpected = Array.from(combinator.diff.aNotB.values());
    // in next but not previous
    const missing = Array.from(combinator.diff.bNotA.values());
    // normal role-permissions
    const normal = Array.from(combinator.bJoinA.a.values());

    return {
      unexpected,
      missing,
      normal,
    };
  }


  /**
   * Create a user
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    dto: ICreateUserDto;
  }): Promise<UserModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;

    const existing = await UserModel.findOne({ where: { [UserField.name]: dto.name }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [UserField.name]: [this.ctx.lang(UserLang.AlreadyExists({ name: dto.name }))] }
      }));
      throw nameViolation
    }

    const user = UserModel.build({
      name: dto.name,
    });

    await user.save({ transaction });
    return user;
  }


  /**
   * Update a user
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    model: UserModel;
    dto: IUpdateUserDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }


  /**
   * Delete a user
   *
   * @param arg
   */
  async delete(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<UserModel> {
    const { model, runner, } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
