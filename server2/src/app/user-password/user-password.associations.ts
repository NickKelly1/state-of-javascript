import { Association } from "sequelize/types";
import { UserModel, UserPasswordModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";

export interface UserPasswordAssociations {
  [index: string]: Association;
  user: Association<UserPasswordModel, UserModel>;
}

export const UserPasswordAssociation: K2K<UserPasswordAssociations> = {
  user: 'user',
}
