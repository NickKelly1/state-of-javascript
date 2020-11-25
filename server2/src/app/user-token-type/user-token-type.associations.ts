import { Association } from "sequelize";
import { K2K } from "../../common/types/k2k.type";
import { UserTokenModel } from "../user-token/user-token.model";
import { UserTokenTypeModel } from "./user-token-type.model";

export interface UserTokenTypeAssociations {
  [index: string]: Association;
  links: Association<UserTokenTypeModel, UserTokenModel>;
};

export const UserTokenTypeAssociation: K2K<UserTokenTypeAssociations> = {
  links: 'links',
}