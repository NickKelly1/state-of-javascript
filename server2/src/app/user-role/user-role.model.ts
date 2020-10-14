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
  [UserRoleAssociation.role]?: PermissionModel;

  // associations
  getUser!: BelongsToGetAssociationMixin<UserModel>;
  getRole!: BelongsToGetAssociationMixin<RoleModel>;
}


export const initUserRoleModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;
  UserRoleModel.init({
    id: AutoIncrementingId,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'user_roles',
    ...AuditableSchema,
  });
}
