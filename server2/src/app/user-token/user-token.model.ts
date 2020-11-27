import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { UserTokenId } from './user-token.id.type';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { IUserTokenAttributes, IUserTokenCreationAttributes, UserTokenField } from './user-token.attributes';
import { UserTokenAssociation, UserTokenAssociations } from './user-token.associations';
import { UserTokenTypeId } from '../user-token-type/user-token-type.id.type';
import { OrNull } from '../../common/types/or-null.type';
import { IJson } from '../../common/interfaces/json.interface';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { UserId } from '../user/user.id.type';
import { UserTokenTypeModel, UserModel } from '../../circle';
import { ist } from '../../common/helpers/ist.helper';
import { UserTokenType } from '../user-token-type/user-token-type.const';


export class UserTokenModel extends Model<IUserTokenAttributes, IUserTokenCreationAttributes> implements IUserTokenAttributes {
  [UserTokenField.id]!: UserTokenId;
  [UserTokenField.user_id]!: UserId;
  [UserTokenField.type_id]!: UserTokenTypeId;
  [UserTokenField.slug]!: string;
  [UserTokenField.redirect_uri]!: OrNull<string>;
  [UserTokenField.data]!: OrNull<IJson>;
  [UserTokenField.expires_at]!: OrNull<Date>;
  [UserTokenField.created_at]!: Date;
  [UserTokenField.updated_at]!: Date;
  [UserTokenField.deleted_at]!: Date;

  // acceptable associations
  static associations: UserTokenAssociations;

  // eager loaded associations
  [UserTokenAssociation.user]?: UserModel;
  [UserTokenAssociation.type]?: UserTokenTypeModel;

  // associations
  //

  isWelcome() { return this[UserTokenField.type_id] === UserTokenType.AcceptWelcome; }
  isForgottenPasswordReset() { return this[UserTokenField.type_id] === UserTokenType.ForgottenPasswordReset; }
  isVerifyEmail() { return this[UserTokenField.type_id] === UserTokenType.VerifyEmail; }

  /**
   * Is the token expired?
   */
  isExpired(): boolean {
    if (ist.nullable(this.expires_at)) return false;
    return this.expires_at.valueOf() <= Date.now();
  }

  redirectUriWithSlug(): OrNull<string> {
    if (ist.nullable(this.redirect_uri)) return null;
    if (this.redirect_uri.includes('?')) return `${this.redirect_uri}&token=${this.slug}`;
    return `${this.redirect_uri}?token=${this.slug}`;
  }
}


export const initUserTokenModel: ModelInitFn = (arg) => {
  const { env, sequelize } = arg;

  UserTokenModel.init({
    id: AutoIncrementingId,
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: UserModel as typeof Model, key: UserTokenField.user_id, }, },
    type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: UserTokenTypeModel as typeof Model, key: UserTokenField.type_id, }, },
    slug: { type: DataTypes.TEXT, allowNull: false, },
    redirect_uri: { type: DataTypes.TEXT, allowNull: true, },
    data: { type: DataTypes.JSONB, allowNull: true, },
    expires_at: { type: DataTypes.DATE, allowNull: true, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'user_tokens',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
};
