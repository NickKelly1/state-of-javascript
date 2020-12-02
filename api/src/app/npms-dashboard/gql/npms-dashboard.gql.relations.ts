import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { NpmsDashboardModel } from "../npms-dashboard.model";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { Op } from "sequelize";
import { NpmsDashboardItemModel, NpmsPackageModel } from "../../../circle";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { NpmsDashboardItemCollectionGqlNode, INpmsDashboardItemCollectionGqlNodeSource } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.options";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { INpmsPackageCollectionGqlNodeSource, NpmsPackageCollectionGqlNode } from "../../npms-package/gql/npms-package.collection.gql.node";
import { NpmsPackageCollectionOptionsGqlInput } from "../../npms-package/gql/npms-package.collection.gql.options";
import { NpmsPackageAssociation } from "../../npms-package/npms-package.associations";
import { NpmsDashboardItemAssociation } from "../../npms-dashboard-item/npms-dashboard-item.associations";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { INpmsDashboardStatusGqlNodeSource, NpmsDashboardStatusGqlNode } from "../../npms-dashboard-status/gql/npms-dashboard-status.gql.node";
import { NpmsDashboardStatusModel } from "../../npms-dashboard-status/npms-dashboard-status.model";


export type INpmsDashboardGqlRelationsSource = NpmsDashboardModel;
export const NpmsDashboardGqlRelations: GraphQLObjectType<INpmsDashboardGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardRelations',
  fields: () => ({
    /**
     * Status
     */
    status: {
      type: NpmsDashboardStatusGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<INpmsDashboardStatusGqlNodeSource>> => {
        const model: OrNull<NpmsDashboardStatusModel> = await ctx.loader.npmsDashboardStatus.load(parent.status_id);
        if (!model) return null;
        if (!ctx.services.npmsDashboardStatusPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    /**
     * Items
     */
    items: {
      type: GraphQLNonNull(NpmsDashboardItemCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardItemCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardItemCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsDashboardItemRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [NpmsDashboardItemField.dashboard_id]: { [Op.eq]: parent.id } },
            ]),
            // eager load packages
            include: { association: NpmsDashboardItemAssociation.npmsPackage, },
          },
        });
        // prime / eager load Packages
        rows.forEach(row => {
          const npmsPackage = assertDefined(row.npmsPackage);
          ctx.loader.npmsPackage.prime(npmsPackage.id, npmsPackage);
        });

        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: INpmsDashboardItemCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsDashboardItemModel> =>
            ctx.services.npmsDashboardItemPolicy.canFindOne({
              model,
              dashboard: parent,
              npmsPackage: assertDefined(model.npmsPackage)
            })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },

    /**
     * Packages
     */
    npmsPackages: {
      type: GraphQLNonNull(NpmsPackageCollectionGqlNode),
      args: gqlQueryArg(NpmsPackageCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsPackageCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsPackageRepository.findAllAndCount({
          runner: null,
          unordered: true,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [
              {
                association: NpmsPackageAssociation.dashboards,
                where: { id: { [Op.eq]: parent.id }, },
              }, {
                association: NpmsPackageAssociation.dashboard_items,
                // TODO: this order doesn't seem to work?
                // order: [[NpmsDashboardItemField.order, 'ASC']],
              }
            ],
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: INpmsPackageCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsPackageModel> =>
            ctx.services.npmsPackagePolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },
  }),
});
