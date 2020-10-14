import { Model, DataTypes, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { RolePermissionAssociation, RolePermissionAssociations } from './role-permission.associations';
import { IRolePermissionAttributes, IRolePermissionCreationAttributes, RolePermissionField } from '../role-permission/role-permission.attributes';
import { RolePermissionId } from './role-permission.id.type';
import { PermissionModel } from '../../circle';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { PermissionId } from '../permission/permission-id.type';


export class RolePermissionModel extends Model<IRolePermissionAttributes, IRolePermissionCreationAttributes> implements IRolePermissionAttributes {
  // fields
  [RolePermissionField.id]!: RolePermissionId;
  [RolePermissionField.role_id]!: RoleId;
  [RolePermissionField.permission_id]!: PermissionId;
  [RolePermissionField.created_at]!: Date;
  [RolePermissionField.updated_at]!: Date;


  // acceptable associations
  static associations: RolePermissionAssociations;

  // eager loaded associations
  [RolePermissionAssociation.role]?: RoleModel;
  [RolePermissionAssociation.permission]?: PermissionModel;

  // associations
  getRole!: BelongsToGetAssociationMixin<RoleModel>;
  getPermission!: BelongsToGetAssociationMixin<PermissionModel>;
}


export const initRolePermissionModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;
  RolePermissionModel.init({
    id: AutoIncrementingId,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'role_permissions',
    ...AuditableSchema,
  });
}
