import { METHODS } from "http";
import qs from 'qs';
import { ApiConnector } from "../../api.connector";
import { ApiQuery } from "../../api.query.types";
import { serializeApiQuery } from "../../serialize-api-query";
import { IApiCollection } from "../../types/api-collection.interface";
import { IApiResource } from "../../types/api-resource.interface";
import { ICreatePermissionDto } from "./dtos/create-permission.dto";
import { IPermissionRo } from "./dtos/permission.ro";
import { PermissionId } from "./permission.id";

export class ApiPermissionService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  async findMany(arg: { query?: ApiQuery }): Promise<IApiCollection<IPermissionRo>> {
    const { query } = arg;
    const strQs = qs.stringify(serializeApiQuery({ query }));
    const result = await this.apiConnector.json<IApiCollection<IPermissionRo>>(`/v1/permissions?${strQs}`);
    return result;
  }

  async findOne(arg: { id: PermissionId }): Promise<IApiResource<IPermissionRo>> {
    const { id } = arg;
    const result = await this.apiConnector.json<IApiResource<IPermissionRo>>(`/v1/permissions/${id}`);
    return result;
  }
}