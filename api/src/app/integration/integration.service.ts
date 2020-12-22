import { BaseContext } from '../../common/context/base.context';
import { ist } from '../../common/helpers/ist.helper';
import { IJson } from '../../common/interfaces/json.interface';
import { QueryRunner } from '../db/query-runner';
import { IIntegrationServiceInitialiseIntegrationCredentialsDto } from './dtos/integration-service.initialise-integration-credentials.dto';
import { IIntegrationServiceResetIntegrationDto } from './dtos/integration-service.reset-integration.dto';
import { IIntegrationServiceUpdateIntegrationDto } from './dtos/integration-service.update-integration.dto';
import { IntegrationModel } from './integration.model';

export class IntegrationService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Encrypt something using the integration model
   *
   * @param arg
   */
  encrypt(arg: { model: IntegrationModel; decrypted: string }): string {
    const { model, decrypted } = arg;
    const encrypted = this
      .ctx
      .services
      .universal
      .encryptionService
      .encrypt({
        decrypted,
        iv: model.iv,
      });
    return encrypted;
  }


  /**
   * Decrypt something using the integration model
   *
   * @param arg
   */
  decrypt(arg: { model: IntegrationModel; encrypted: string }): string {
    const { model, encrypted } = arg;
    const decrypted = this
      .ctx
      .services
      .universal
      .encryptionService
      .decrypt({
        encrypted,
        iv: model.iv,
      });
    return decrypted;
  }


  /**
   * Reset the credentials that the integration uses
   *
   * typically client_secret, client_id, ...
   *
   * @param arg
   */
  async initialiseIntegration(arg: {
    runner: QueryRunner;
    model: IntegrationModel;
    dto: IIntegrationServiceInitialiseIntegrationCredentialsDto;
  }): Promise<IntegrationModel> {
    const { model, dto, runner } = arg;
    const { transaction } = runner;

    // unset all stateful data
    model.error = null;
    model.is_connected = false;
    model.public = null;
    model.encrypted_state = null;

    // TODO: handle init nicely for different integrations...
    let init: IJson;
    if (model.isGoogle()) {
      init = this.ctx.services.googleService.getIntegrationInit({ dto });
    }
    else {
      throw new Error(`TODO: unhandled integration: "${model.id}`);
    }
    

    // get a new iv
    model.iv = this.ctx.services.universal.encryptionService.iv();

    // update the encrypted init data
    model.encrypted_init = this.encrypt({ model, decrypted: JSON.stringify(init), });

    // save & finish
    await model.save({ transaction });

    return model;
  }


  async reset(arg: {
    model: IntegrationModel;
    runner: QueryRunner;
    dto: IIntegrationServiceResetIntegrationDto;
  }): Promise<IntegrationModel> {
    const { model, runner, dto } = arg;
    const { transaction } = runner;


    model.encrypted_init = null;
    model.encrypted_state = null;
    model.is_connected = false;

    // update error?
    if (ist.notUndefined(dto.error)) { model.error = dto.error; }
    else { model.error = null; }

    // update public?
    if (ist.notUndefined(dto.public)) { model.public = dto.public; }
    else { model.error = null; }

    // save
    await model.save({ transaction });

    return model;
  }


  /**
   * Update a model
   *
   * @param arg
   */
  async update(arg: {
    model: IntegrationModel;
    dto: IIntegrationServiceUpdateIntegrationDto;
    runner: QueryRunner,
  }): Promise<IntegrationModel> {
    const { model, dto, runner } = arg;
    const { transaction } = runner;

    // update init?
    if (ist.notUndefined(dto.init)) {
      if (ist.null(dto.init)) {
        model.encrypted_init = null;
      }
      else {
        model.encrypted_init = this.encrypt({ model, decrypted: JSON.stringify(dto.init) });
      }
    }

    // update data?
    if (ist.notUndefined(dto.state)) {
      if (ist.null(dto.state)) {
        model.encrypted_state = null;
      }
      else {
        model.encrypted_state = this.encrypt({ model, decrypted: JSON.stringify(dto.state) });
      }
    }

    // update error?
    if (ist.notUndefined(dto.error)) {
      model.error = dto.error;
    }

    // update is_connected?
    if (ist.notUndefined(dto.is_connected)) {
      model.is_connected = dto.is_connected; 
    }

    // update public?
    if (ist.notUndefined(dto.public)) {
      model.public = dto.public;
    }

    // save
    await model.save({ transaction });

    return model;
  }
}
