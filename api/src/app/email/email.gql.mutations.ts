import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  Thunk,
} from "graphql";
import Joi from "joi";
import { GqlContext } from '../../common/context/gql.context';
import { OrNullable } from "../../common/types/or-nullable.type";
import { EmailLang } from './email.lang';

interface ISendEmailInput {
  to: OrNullable<string[]>;
  cc: OrNullable<string[]>;
  subject: string;
  text: string;
}

export const SendEmailInput = new GraphQLInputObjectType({
  name: 'SendEmailInput',
  fields: () => ({
    to: { type: GraphQLList(GraphQLNonNull(GraphQLString)), },
    cc: { type: GraphQLList(GraphQLNonNull(GraphQLString)), },
    subject: { type: GraphQLNonNull(GraphQLString), },
    text: { type: GraphQLNonNull(GraphQLString), },
  }),
});

const SendEmailInputValidator = Joi.object<ISendEmailInput>({
  to: Joi.array().items(Joi.string()).optional(),
  cc: Joi.array().items(Joi.string()).optional(),
  subject: Joi.string().required(),
  text: Joi.string().required(),
});


export const EmailGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Create a User
   */
  sendEmail: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(SendEmailInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // authorise access
      ctx.authorize(ctx.services.emailPolicy.canSendEmail(), EmailLang.CannotSendEmail);

      // validate
      const dto = ctx.validate(SendEmailInputValidator, args.dto);

      await ctx.services.universal.jobService.email.enqueue({
        to: dto.to ?? null,
        cc: dto.cc ?? null,
        subject: dto.subject,
        text: dto.text,
      })

      return true;
    },
  },
});