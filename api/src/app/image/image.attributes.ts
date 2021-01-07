import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { ImageId } from "./image.id.type";
import { OrNull } from "../../common/types/or-null.type";


// todo: fix....
export interface IImageAttributes extends IAuditable, ISoftDeleteable {
  id: ImageId;
  fsid: string;
  title: string;
  thumbnail_id: OrNull<ImageId>;
  original_id: OrNull<ImageId>;
  display_id: OrNull<ImageId>;
}

export const ImageField: K2K<IImageAttributes> = {
  id: 'id',
  fsid: 'fsid',
  title: 'title',
  thumbnail_id: 'thumbnail_id',
  original_id: 'original_id',
  display_id: 'display_id',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IImageCreationAttributes extends Optional<IImageAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}
