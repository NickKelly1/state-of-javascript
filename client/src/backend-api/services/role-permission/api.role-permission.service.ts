import { METHODS } from "http";
import qs from 'qs';
import { ApiConnector } from "../../api.connector";
import { ApiQuery } from "../../api.query.types";
import { serializeApiQuery } from "../../serialize-api-query";
import { IApiCollection } from "../../types/api-collection.interface";
import { IApiResource } from "../../types/api-resource.interface";
import { ICreateRolePermissionDto } from "./dtos/create-role-permission.dto";
import { IRolePermissionRo } from "./dtos/role-permission.ro";
import { RolePermissionId } from "./role-permission.id";

export class ApiRolePermissionService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  async findMany(arg: { query?: ApiQuery }): Promise<IApiCollection<IRolePermissionRo>> {
    const { query } = arg;
    const strQs = qs.stringify(serializeApiQuery({ query }));
    const result = await this.apiConnector.json<IApiCollection<IRolePermissionRo>>(`/v1/role-permissions?${strQs}`);
    return result;
  }

  async findOne(arg: { id: RolePermissionId }): Promise<IApiResource<IRolePermissionRo>> {
    const { id } = arg;
    const result = await this.apiConnector.json<IApiResource<IRolePermissionRo>>(`/v1/role-permissions/${id}`);
    return result;
  }

  async create(arg: { dto: ICreateRolePermissionDto }): Promise<IApiResource<IRolePermissionRo>> {
    const { dto } = arg;
    const result = await this.apiConnector.json<IApiResource<IRolePermissionRo>>('/v1/role-permissions', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return result;
  }

  // TODO
  async delete() {
    //
  }
}