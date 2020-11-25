import { Model, DataTypes, HasOneGetAssociationMixin, HasManyGetAssociationsMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { OrNull } from '../../common/types/or-null.type';
import { RoleAssociation, RoleAssociations } from './role.associations';
import { IRoleAttributes, IRoleCreationAttributes, RoleField } from '../role/role.attributes';
import { RoleDefinition } from './role.definition';
import { RoleId } from './role.id.type';
import { PermissionModel, UserModel } from '../../circle';
import { UserRoleModel } from '../user-role/user-role.model';
import { RolePermissionModel } from '../role-permission/role-permission.model';
import { Role } from './role.const';


export class RoleModel extends Model<IRoleAttributes, IRoleCreationAttributes> implements IRoleAttributes {
  // fields
  [RoleField.id]!: RoleId;
  [RoleField.name]!: string;
  [RoleField.created_at]!: Date;
  [RoleField.updated_at]!: Date;
  [RoleField.deleted_at]!: OrNull<Date>;


  // acceptable associations
  static associations: RoleAssociations;

  // eager loaded associations
  [RoleAssociation.users]?: UserModel[];
  [RoleAssociation.permissions]?: PermissionModel[];
  [RoleAssociation.userRoles]?: UserRoleModel[];
  [RoleAssociation.rolePermissions]?: RolePermissionModel[];

  // associations
  getUsers!: HasManyGetAssociationsMixin<UserModel>;
  getPermissions!: HasManyGetAssociationsMixin<PermissionModel>;
  getUserRoles!: HasManyGetAssociationsMixin<UserRoleModel>;
  getRolePermissions!: HasManyGetAssociationsMixin<RolePermissionModel>;

  // helpers
  isAdmin() { return this[RoleField.id] === Role.Admin; }
  isAuthenticated() { return this[RoleField.id] === Role.Authenticated; }
  isPublic() { return this[RoleField.id] === Role.Public; }
}


export const initRoleModel: ModelInitFn = (arg) => {
  const { env, sequelize } = arg;
  RoleModel.init({
    id: AutoIncrementingId,
    name: {
      type: DataTypes.STRING(RoleDefinition.name.max),
      unique: true,
      allowNull: false,
    },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'roles',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
