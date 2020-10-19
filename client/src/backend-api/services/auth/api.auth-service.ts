import { ApiConnector } from "../../api.connector";
import { ISignupDto } from "./dtos/signup.dto";
import { ISignupRo } from "./dtos/signup.ro";

export class ApiAuthService {
  constructor(
    protected readonly apiConnector: ApiConnector,
  ) {
    //
  }

  // async login(): Promise<IApiCollection<IUserRo>> {
  //   const result = await this.apiConnector.json<IApiCollection<IUserRo>>('/v1/auth/login');
  //   return result;
  // }

  async signup(arg: { dto: ISignupDto }): Promise<ISignupRo> {
    const { dto } = arg;
    const result = await this.apiConnector.json<ISignupRo>(`/v1/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return result;
  }

  // async me(arg: { dto: ICreateUserDto }): Promise<IApiResource<IUserRo>> {
  //   const { dto } = arg;
  //   const result = await this.apiConnector.json<IApiResource<IUserRo>>(
  //     '/users',
  //     {
  //       method: 'POST',
  //       body: JSON.stringify(dto),
  //     }
  //   );
  //   return result;
  // }
}