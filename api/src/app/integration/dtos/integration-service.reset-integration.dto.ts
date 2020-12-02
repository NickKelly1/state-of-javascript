import Joi from 'joi';
import { PermissionModel } from '../../../circle';
import { IJson } from '../../../common/interfaces/json.interface';
import { OrNull } from '../../../common/types/or-null.type';
import { IntegrationDefinition } from '../integration.definition';

export interface IIntegrationServiceResetIntegrationDto {
  error?: OrNull<string>;
  public?: OrNull<string>;
}
