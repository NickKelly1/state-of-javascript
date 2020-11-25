import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { UserTokenTypeAssociation, UserTokenTypeAssociations } from './user-token-type.associations';
import { UserTokenTypeId } from './user-token-type.id.type';
import { UserTokenTypeDefinition } from './user-token-type.definition';
import { IUserTokenTypeAttributes, IUserTokenTypeCreationAttributes, UserTokenTypeField } from './user-token-type.attributes';
import { UserTokenModel } from '../user-token/user-token.model';


export class UserTokenTypeModel extends Model<IUserTokenTypeAttributes, IUserTokenTypeCreationAttributes> implements IUserTokenTypeAttributes {
  // fields
  [UserTokenTypeField.id]!: UserTokenTypeId;
  [UserTokenTypeField.name]!: string;

  [UserTokenTypeField.created_at]!: Date;
  [UserTokenTypeField.updated_at]!: Date;

  // acceptable associations
  static associations: UserTokenTypeAssociations;

  // eager loaded associations
  [UserTokenTypeAssociation.links]?: UserTokenModel[];
}


export const initUserTokenTypeModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  UserTokenTypeModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, },
    name: { type: DataTypes.STRING(UserTokenTypeDefinition.name.max), allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'user_token_types',
    ...AuditableSchema,
  });
}
