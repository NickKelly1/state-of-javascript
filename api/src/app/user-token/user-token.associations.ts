import { Association } from "sequelize";
import { UserTokenModel, UserTokenTypeModel, UserModel, UserPasswordModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";

export interface UserTokenAssociations {
  [index: string]: Association;
  user: Association<UserTokenModel, UserModel>;
  type: Association<UserTokenModel, UserTokenTypeModel>;
}

export const UserTokenAssociation: K2K<UserTokenAssociations> = {
  user: 'user',
  type: 'type',
}
