import { ALanguage, Language } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { langMatch } from '../i18n/helpers/lange-match.helper';
import { IRequestServices } from '../interfaces/request.services.interface';
import { IJson } from '../interfaces/json.interface';
import {
  _and,
  _attr,
  _or,
  _val,
} from '../schemas/api.query.types';
import { RequestSerivceContainer } from '../containers/request.service.container';
import { Permission } from '../../app/permission/permission.const';
import { User } from '../../app/user/user.const';
import { UniversalSerivceContainer } from '../containers/universal.service.container';
import { BaseContext } from './base.context';
import { RequestAuth } from '../classes/request-auth';


export class SystemContext extends BaseContext {
  readonly auth: RequestAuth;
  public readonly services: IRequestServices;

  constructor(
    universal: UniversalSerivceContainer,
  ) {
    super();
    // give ambient context all permissions
    this.auth = new RequestAuth(Object.values(Permission), User.System);
    this.services = new RequestSerivceContainer(this, universal)
  }

  info(): IJson {
    return {};
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = [Language.En];
    return langMatch(languages, switcher);
  }
}
