export {};

// import { FindAndCountOptions, OrderItem, WhereOptions } from "sequelize";
// import { IPaginateInput } from "../interfaces/pageinate-input.interface";
// import { OrUndefined } from "../types/or-undefined.type";
// import { transformGqlFilter } from "./gql.filter.transformer";
// import { CollectionOptionsValidator, IGqlCollectionOptions } from "./gql.collection.options";
// import { IGqlQueryArg } from "./gql.query.arg";
// import { GqlDirEnum } from "./gql.sort.enum";
// import { BaseContext } from "../context/base.context";

// export interface ITransformGqlQueryArg {
//   ctx: BaseContext;
//   // args from GraphQL query
//   args: { [_q: string]: any };
// }

// export interface ITransformGqlQueryReturn {
//   page: IPaginateInput;
//   options: FindAndCountOptions,
// }

// export function transformGqlQuery(arg: ITransformGqlQueryArg): ITransformGqlQueryReturn {
//   const { args, ctx } = arg;
//   const options: Partial<IGqlCollectionOptions> = ((args ?? {}) as Partial<IGqlQueryArg>)?.query ?? {};
//   ctx.validate(CollectionOptionsValidator, options);

//   const limit = options.limit ?? 15;
//   const offset = options.offset ?? 0;
//   let order: OrUndefined<OrderItem[]>;
//   let where: OrUndefined<WhereOptions>;

//   // transform sorts
//   if (options.sorts) {
//     order = options.sorts.map((sort): OrderItem => [
//       sort.field,
//       sort.dir === GqlDirEnum.Asc ? 'ASC' : 'DESC',
//     ]);
//   }

//   // transform filter
//   if (options.filter) {
//     where = transformGqlFilter(options.filter);
//   }

//   const page: IPaginateInput=  { limit, offset };
//   return {
//     options: {
//       where,
//       order,
//       limit,
//       offset,
//     },
//     page,
//   };
// }
