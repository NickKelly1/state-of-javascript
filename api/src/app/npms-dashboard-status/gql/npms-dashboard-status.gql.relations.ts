import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardStatusModel } from "../npms-dashboard-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NewsArticleCollectionOptionsGqlInput } from "../../news-article/gql/news-article.collection.gql.options";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { NewsArticleField } from "../../news-article/news-article.attributes";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { NewsArticleModel } from "../../../circle";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.options";
import { NpmsDashboardField } from "../../npms-dashboard/npms-dashboard.attributes";
import { NpmsDashboardModel } from "../../npms-dashboard/npms-dashboard.model";


export type INpmsDashboardStatusGqlRelationsSource = NpmsDashboardStatusModel;
export const NpmsDashboardStatusGqlRelations: GraphQLObjectType<INpmsDashboardStatusGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardStatusRelations',
  fields: () => ({
    npmsDashboards: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsDashboardRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              // TODO...
              { [NpmsDashboardField.status_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: INpmsDashboardCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsDashboardModel> =>
            ctx.services.npmsDashboardPolicy.canFindOne({ model })
              ? model
              : null
            ),
          pagination,
        };
        return connection;
      },
    },
  }),
});
