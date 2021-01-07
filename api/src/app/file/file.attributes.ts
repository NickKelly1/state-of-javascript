import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { FileId } from "./file.id.type";
import { UserId } from "../user/user.id.type";
import { OrNull } from "../../common/types/or-null.type";


export interface IFileAttributes extends IAuditable, ISoftDeleteable {
  id: FileId;
  uploader_aid: OrNull<string>;
  uploader_id: OrNull<UserId>;
  is_public: boolean;
  filename: string;
  title: string;
  encoding: string;
  mimetype: string;
}

export const FileField: K2K<IFileAttributes> = {
  id: 'id',
  uploader_aid: 'uploader_aid',
  uploader_id: 'uploader_id',
  is_public: 'is_public',
  filename: 'filename',
  title: 'title',
  encoding: 'encoding',
  mimetype: 'mimetype',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileCreationAttributes extends Optional<IFileAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}
