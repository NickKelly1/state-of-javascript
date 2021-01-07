import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { FileAssociation, FileAssociations } from './file.associations';
import { FileId } from './file.id.type';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../user/user.model';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { UserField } from '../user/user.attributes';
import { RequestAuth } from '../../common/classes/request-auth';
import { FileField, IFileAttributes, IFileCreationAttributes } from './file.attributes';
import { BaseContext } from '../../common/context/base.context';
import { ImageModel } from '../image/image.model';


export class FileModel extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
  // fields
  [FileField.id]!: FileId;

  [FileField.uploader_aid]!: string;
  [FileField.uploader_id]!: UserId;

  [FileField.title]!: string;
  [FileField.is_public]!: boolean;
  [FileField.filename]!: string;
  [FileField.mimetype]!: string;
  [FileField.encoding]!: string;

  [FileField.created_at]!: Date;
  [FileField.updated_at]!: Date;
  [FileField.deleted_at]!: Date;


  // associations
  static associations: FileAssociations;

  // relations
  [FileAssociation.uploader]?: UserModel;
  [FileAssociation.display_images]?: ImageModel;
  [FileAssociation.original_images]?: ImageModel;
  [FileAssociation.thumbnail_images]?: ImageModel;

  authIsUploader(auth: RequestAuth): boolean { return auth.isMeById(this.uploader_id); }
  ctxIsUploader(ctx: BaseContext): boolean { return this.authIsUploader(ctx.auth); }
}


export const initFileModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  FileModel.init({
    id: AutoIncrementingId,
    uploader_aid: { type: DataTypes.STRING(255), allowNull: true, },
    title: { type: DataTypes.STRING(255), allowNull: false, },
    uploader_id: {
      type: DataTypes.INTEGER,
      references: { model: UserModel as typeof Model, key: UserField.id },
      allowNull: true,
    },
    is_public: { type: DataTypes.BOOLEAN, allowNull: false, },
    mimetype: { type: DataTypes.STRING(50), allowNull: true, },
    encoding: { type: DataTypes.STRING(50), allowNull: true, },
    filename: { type: DataTypes.TEXT, allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'files',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
