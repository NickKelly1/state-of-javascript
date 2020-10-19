import { METHODS } from "http";
import qs from 'qs';
import { ApiConnector } from "../../api.connector";
import { ApiQuery } from "../../api.query.types";
import { serializeApiQuery } from "../../serialize-api-query";
import { IApiCollection } from "../../types/api-collection.interface";
import { IApiResource } from "../../types/api-resource.interface";
import { ICreateUserDto } from "./dtos/create-user.dto";
import { IUserRo } from "./dtos/user.ro";
import { UserId } from "./user.id";

export class ApiUserService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  async findMany(arg: { query?: ApiQuery }): Promise<IApiCollection<IUserRo>> {
    const { query } = arg;
    const strQs = qs.stringify(serializeApiQuery({ query }));
    const result = await this.apiConnector.json<IApiCollection<IUserRo>>(`/v1/users?${strQs}`);
    return result;
  }

  async findOne(arg: { id: UserId }): Promise<IApiResource<IUserRo>> {
    const { id } = arg;
    const result = await this.apiConnector.json<IApiResource<IUserRo>>(`/v1/users/${id}`);
    return result;
  }

  async create(arg: { dto: ICreateUserDto }): Promise<IApiResource<IUserRo>> {
    const { dto } = arg;
    const result = await this.apiConnector.json<IApiResource<IUserRo>>('/v1/users', {
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