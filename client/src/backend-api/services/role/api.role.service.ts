import { METHODS } from "http";
import qs from 'qs';
import { ApiConnector } from "../../api.connector";
import { ApiQuery } from "../../api.query.types";
import { serializeApiQuery } from "../../serialize-api-query";
import { IApiCollection } from "../../types/api-collection.interface";
import { IApiResource } from "../../types/api-resource.interface";
import { ICreateRoleDto } from "./dtos/create-role.dto";
import { IRoleRo } from "./dtos/role.ro";
import { RoleId } from "./role.id";

export class ApiRoleService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  async findMany(arg: { query?: ApiQuery }): Promise<IApiCollection<IRoleRo>> {
    const { query } = arg;
    const strQs = qs.stringify(serializeApiQuery({ query }));
    const result = await this.apiConnector.json<IApiCollection<IRoleRo>>(`/v1/roles?${strQs}`);
    return result;
  }

  async findOne(arg: { id: RoleId }): Promise<IApiResource<IRoleRo>> {
    const { id } = arg;
    const result = await this.apiConnector.json<IApiResource<IRoleRo>>(`/v1/roles/${id}`);
    return result;
  }

  async create(arg: { dto: ICreateRoleDto }): Promise<IApiResource<IRoleRo>> {
    const { dto } = arg;
    const result = await this.apiConnector.json<IApiResource<IRoleRo>>('/v1/roles', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return result;
  }

  // TODO
  async update() {
    //
  }

  // TODO
  async delete() {
    //
  }
}