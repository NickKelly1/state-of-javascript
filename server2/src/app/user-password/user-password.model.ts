import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { UserPasswordId } from './user-password.id.type';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../../circle';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { IUserPasswordAttributes, IUserPasswordCreationAttributes, UserPasswordField } from './user-password.attributes';
import { UserPasswordAssociation, UserPasswordAssociations } from './user-password.associations';


export class UserPasswordModel extends Model<IUserPasswordAttributes, IUserPasswordCreationAttributes> implements IUserPasswordAttributes {
  [UserPasswordField.id]!: UserPasswordId;
  [UserPasswordField.user_id]!: UserId;
  [UserPasswordField.salt]!: string;
  [UserPasswordField.hash]!: string;
  [UserPasswordField.created_at]!: Date;
  [UserPasswordField.updated_at]!: Date;

  // acceptable associations
  static associations: UserPasswordAssociations;

  // eager loaded associations
  [UserPasswordAssociation.user]?: UserModel;

  // associations
  getUser!: BelongsToGetAssociationMixin<UserModel>;
}


export const initUserPasswordModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;

  UserPasswordModel.init({
    id: AutoIncrementingId,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...pretendAuditable,
  }, {
    sequelize: sequelize,
    tableName: 'user_passwords',
    ...AuditableSchema,
  });
};
