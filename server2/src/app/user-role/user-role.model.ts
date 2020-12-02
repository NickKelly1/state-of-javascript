import { Model, DataTypes, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { UserRoleAssociation, UserRoleAssociations } from './user-role.associations';
import { IUserRoleAttributes, IUserRoleCreationAttributes, UserRoleField } from '../user-role/user-role.attributes';
import { UserRoleId } from './user-role.id.type';
import { PermissionModel, UserModel } from '../../circle';
import { UserId } from '../user/user.id.type';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { UserField } from '../user/user.attributes';
import { RoleField } from '../role/role.attributes';


export class UserRoleModel extends Model<IUserRoleAttributes, IUserRoleCreationAttributes> implements IUserRoleAttributes {
  // fields
  [UserRoleField.id]!: UserRoleId;
  [UserRoleField.user_id]!: UserId;
  [UserRoleField.role_id]!: RoleId;
  [UserRoleField.created_at]!: Date;
  [UserRoleField.updated_at]!: Date;


  // acceptable associations
  static associations: UserRoleAssociations;

  // eager loaded associations
  [UserRoleAssociation.user]?: UserModel;
  [UserRoleAssociation.role]?: RoleModel;

  // associations
  getUser!: BelongsToGetAssociationMixin<UserModel>;
  getRole!: BelongsToGetAssociationMixin<RoleModel>;
}


export const initUserRoleModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  UserRoleModel.init({
    id: AutoIncrementingId,
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: UserModel as typeof Model, key: UserField.id },
      unique: 'user_id_role_id',
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: { model: RoleModel as typeof Model, key: RoleField.id },
      unique: 'user_id_role_id',
      allowNull: false,
    },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'user_roles',
    ...AuditableSchema,
  });
}
