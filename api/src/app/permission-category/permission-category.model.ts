import { Model, DataTypes, HasOneGetAssociationMixin, HasManyGetAssociationsMixin, } from 'sequelize';
import { RoleModel } from '../../circle';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { OrNull } from '../../common/types/or-null.type';
import { IPermissionCategoryAttributes, IPermissionCategoryCreationAttributes, PermissionCategoryField } from '../permission-category/permission-category.attributes';
import { PermissionModel } from '../permission/permission.model';
import { PermissionCategoryId } from './permission-category-id.type';
import { PermissionCategoryAssociations, PermissionCategoryAssociation } from './permission-category.associations';
import { PermissionCategoryDefinition } from './permission-category.definition';


export class PermissionCategoryModel extends Model<IPermissionCategoryAttributes, IPermissionCategoryCreationAttributes> implements IPermissionCategoryAttributes {
  // fields
  [PermissionCategoryField.id]!: PermissionCategoryId;
  [PermissionCategoryField.name]!: string;
  [PermissionCategoryField.colour]!: string;
  [PermissionCategoryField.created_at]!: Date;
  [PermissionCategoryField.updated_at]!: Date;
  [PermissionCategoryField.deleted_at]!: OrNull<Date>;


  // acceptable associations
  static associations: PermissionCategoryAssociations;

  // eager loaded associations
  [PermissionCategoryAssociation.permissions]?: PermissionModel[];

  // associations
  //

  // helpers
  //
}

export const initPermissionCategoryModel: ModelInitFn = (arg) => {
  const { env, sequelize } = arg;
  PermissionCategoryModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, },
    name: { type: DataTypes.STRING(PermissionCategoryDefinition.name.max), unique: true, allowNull: false, },
    colour: { type: DataTypes.STRING(PermissionCategoryDefinition.colour.max), unique: false, allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'permission_categories',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
