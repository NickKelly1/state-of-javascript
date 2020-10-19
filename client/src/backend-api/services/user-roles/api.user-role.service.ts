import { METHODS } from "http";
import qs from 'qs';
import { ApiConnector } from "../../api.connector";
import { ApiQuery } from "../../api.query.types";
import { serializeApiQuery } from "../../serialize-api-query";
import { IApiCollection } from "../../types/api-collection.interface";
import { IApiResource } from "../../types/api-resource.interface";
import { ICreateUserRoleDto } from "./dtos/create-user-role.dto";
import { IUserRoleRo } from "./dtos/user-role.ro";
import { UserRoleId } from "./user-role.id";

export class ApiUserRoleService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  async findMany(arg: { query?: ApiQuery }): Promise<IApiCollection<IUserRoleRo>> {
    const { query } = arg;
    const strQs = qs.stringify(serializeApiQuery({ query }));
    const result = await this.apiConnector.json<IApiCollection<IUserRoleRo>>(`/v1/user-roles?${strQs}`);
    return result;
  }

  async findOne(arg: { id: UserRoleId }): Promise<IApiResource<IUserRoleRo>> {
    const { id } = arg;
    const result = await this.apiConnector.json<IApiResource<IUserRoleRo>>(`/v1/user-roles/${id}`);
    return result;
  }

  async create(arg: { dto: ICreateUserRoleDto }): Promise<IApiResource<IUserRoleRo>> {
    const { dto } = arg;
    const result = await this.apiConnector.json<IApiResource<IUserRoleRo>>('/v1/user-roles', {
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