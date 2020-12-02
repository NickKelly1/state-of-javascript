import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { GqlJsonObjectScalar } from "../../../common/gql/gql.json.scalar";
import { ist } from "../../../common/helpers/ist.helper";
import { IJson } from "../../../common/interfaces/json.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { IntegrationModel } from "../integration.model";

export type IIntegrationGqlDataSource = IntegrationModel;
export const IntegrationGqlData: GraphQLObjectType<IIntegrationGqlDataSource, GqlContext> = new GraphQLObjectType({
  name: 'IntegrationData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    error: { type: GqlJsonObjectScalar },
    public: { type: GqlJsonObjectScalar },
    is_connected!: { type: GraphQLNonNull(GraphQLBoolean) },
    decrypted_init: {
      type: GqlJsonObjectScalar,
      resolve: (parent, args, ctx): OrNull<IJson> => {
        if (!ctx.services.integrationPolicy.canShowSecretsOf({ model: parent })) return null;
        const encrypted = parent.encrypted_init;
        if (ist.null(encrypted)) return null;
        return JSON.parse(ctx.services.integrationService.decrypt({ model: parent, encrypted }));
      },
    },
    decrypted_state: {
      type: GqlJsonObjectScalar,
      resolve: (parent, args, ctx): OrNull<IJson> => {
        if (!ctx.services.integrationPolicy.canShowSecretsOf({ model: parent })) return null;
        const encrypted = parent.encrypted_state;
        if (ist.null(encrypted)) return null;
        return JSON.parse(ctx.services.integrationService.decrypt({ model: parent, encrypted }));
      },
    },

    ...AuditableGql,
  }),
});
