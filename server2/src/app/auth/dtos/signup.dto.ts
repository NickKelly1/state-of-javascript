import Joi from "joi";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";

export interface ISignupDto {
  name: string;
  password: string;
}

export const SignupDto = Joi.object<ISignupDto>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
