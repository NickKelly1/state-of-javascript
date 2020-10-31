import { Model, DataTypes, HasOneGetAssociationMixin, HasManyGetAssociationsMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { OrNull } from '../../common/types/or-null.type';
import { PermissionAssociation, PermissionAssociations } from './permission.associations';
import { IPermissionAttributes, IPermissionCreationAttributes, PermissionField } from '../permission/permission.attributes';
import { PermissionDefinition } from './permission.definition';
import { RoleModel, RolePermissionModel, UserModel } from '../../circle';
import { PermissionId } from './permission-id.type';


export class PermissionModel extends Model<IPermissionAttributes, IPermissionCreationAttributes> implements IPermissionAttributes {
  // fields
  [PermissionField.id]!: PermissionId;
  [PermissionField.name]!: string;
  [PermissionField.created_at]!: Date;
  [PermissionField.updated_at]!: Date;
  [PermissionField.deleted_at]!: OrNull<Date>;


  // acceptable associations
  static associations: PermissionAssociations;

  // eager loaded associations
  [PermissionAssociation.roles]?: RoleModel[];
  [PermissionAssociation.rolePermissions]?: RolePermissionModel[];

  // associations
  getRoles!: HasManyGetAssociationsMixin<RoleModel>;
  getRolePermissions!: HasManyGetAssociationsMixin<RolePermissionModel>;
}

export const initPermissionModel: ModelInitFn = (arg) => {
  const { env, sequelize } = arg;
  PermissionModel.init({
    id: AutoIncrementingId,
    name: {
      type: DataTypes.STRING(PermissionDefinition.name.max),
      unique: true,
      allowNull: false,
    },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'permissions',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
