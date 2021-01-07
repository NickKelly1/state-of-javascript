import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { ImageAssociation, ImageAssociations } from './image.associations';
import { ImageId } from './image.id.type';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { ImageField, IImageAttributes, IImageCreationAttributes } from './image.attributes';
import { FileId } from '../file/file.id.type';
import { FileModel } from '../file/file.model';
import { FileField } from '../file/file.attributes';
import { OrNull } from '../../common/types/or-null.type';

export class ImageModel extends Model<IImageAttributes, IImageCreationAttributes> implements IImageAttributes {
  // fields
  [ImageField.id]!: ImageId;

  [ImageField.fsid]!: string;

  [ImageField.title]!: string;

  // file id of the thumbnail
  [ImageField.thumbnail_id]!: OrNull<FileId>;
  // file id of the display
  [ImageField.display_id]!: OrNull<FileId>;
  // file id of the original
  [ImageField.original_id]!: OrNull<FileId>;

  [ImageField.created_at]!: Date;
  [ImageField.updated_at]!: Date;
  [ImageField.deleted_at]!: Date;


  // acceptable associations
  static associations: ImageAssociations;

  // relations
  [ImageAssociation.thumbnail]?: FileModel;
  [ImageAssociation.display]?: FileModel;
  [ImageAssociation.original]?: FileModel;
}


export const initImageModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  ImageModel.init({
    id: AutoIncrementingId,
    fsid: { type: DataTypes.STRING(255), unique: true, allowNull: false, },
    title: { type: DataTypes.STRING(255), allowNull: false, },
    thumbnail_id: { type: DataTypes.INTEGER, references: { model: FileModel as typeof Model, key: FileField.id }, allowNull: true, },
    display_id: { type: DataTypes.INTEGER, references: { model: FileModel as typeof Model, key: FileField.id }, allowNull: true, },
    original_id: { type: DataTypes.INTEGER, references: { model: FileModel as typeof Model, key: FileField.id }, allowNull: true, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'images',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
