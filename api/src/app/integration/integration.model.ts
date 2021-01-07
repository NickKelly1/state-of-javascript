import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { OrNull } from '../../common/types/or-null.type';
import { IntegrationAssociations } from './integration.associations';
import { IntegrationDefinition } from './integration.definition';
import { IntegrationId } from './integration-id.type';
import { IIntegrationAttributes, IIntegrationCreationAttributes, IntegrationField } from './integration.attributes';
import { Integration } from './integration.const';


export class IntegrationModel extends Model<IIntegrationAttributes, IIntegrationCreationAttributes> implements IIntegrationAttributes {
  // fields
  [IntegrationField.id]!: IntegrationId;
  [IntegrationField.name]!: string;
  [IntegrationField.iv]!: string;
  [IntegrationField.encrypted_init]!: OrNull<string>;
  [IntegrationField.encrypted_state]!: OrNull<string>;
  [IntegrationField.error]!: OrNull<string>;
  [IntegrationField.is_connected]!: boolean;
  [IntegrationField.public]!: OrNull<string>;
  [IntegrationField.created_at]!: Date;
  [IntegrationField.updated_at]!: Date;

  // acceptable associations
  static associations: IntegrationAssociations;

  // eager loaded associations
  //

  // associations
  //

  // helpers
  /**
   * Is connected?
   */
  isConnected(): boolean { return this.is_connected; }
  isGoogle(): boolean { return this.id === Integration.Google; }
}

export const initIntegrationModel: ModelInitFn = (arg) => {
  const { env, sequelize } = arg;
  IntegrationModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, },
    name: { type: DataTypes.STRING(IntegrationDefinition.name.max), allowNull: false, },
    iv: { type: DataTypes.TEXT, allowNull: false, },
    encrypted_init: { type: DataTypes.TEXT, },
    encrypted_state: { type: DataTypes.TEXT, },
    error: { type: DataTypes.TEXT, },
    is_connected: { type: DataTypes.BOOLEAN, allowNull: false, },
    public: { type: DataTypes.TEXT, },
    ...pretendAuditable,
  }, {
    sequelize: sequelize,
    tableName: 'integrations',
    ...AuditableSchema,
  });
}
