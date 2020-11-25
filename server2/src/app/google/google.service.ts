import { IRequestContext } from "../../common/interfaces/request-context.interface";
import * as PR from 'io-ts/PathReporter';
import * as TS from 'io-ts';
import * as OP from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as P from 'fp-ts/pipeable';
import * as Fn from 'fp-ts/function';
import { IntegrationModel } from "../integration/integration.model";
import { ist } from "../../common/helpers/ist.helper";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IIntegrationServiceUpdateIntegrationDto } from "../integration/dtos/integration-service.update-integration.dto";
import { QueryRunner } from "../db/query-runner";
import { unwrap } from "../../common/helpers/unwrap.helper";
import { toString } from "../../common/helpers/to-string.helper";
import { gmail_v1, google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { logger } from "../../common/logger/logger";
import { tap } from "../../common/helpers/tap.helper";
import { IIntegrationServiceResetIntegrationDto } from "../integration/dtos/integration-service.reset-integration.dto";
import { TGoogleInit } from "./types/google.init.type";
import { TGoogleState } from "./types/google.state.type";
import { TGoogleToken } from "./types/google.token.type";
import { IGoogleIntegrationServiceSendEmailDto } from "./dtos/google.service.send-email-dto";
import { IJson } from "../../common/interfaces/json.interface";
import { IIntegrationServiceInitialiseIntegrationCredentialsDto } from "../integration/dtos/integration-service.initialise-integration-credentials.dto";
import { TGoogleCredentials } from "./types/google.credentials.type";
import { $TS_FIX_ME } from "../../common/types/$ts-fix-me.type";


export class GoogleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Fired when the parsing of init fails
   *
   * @param arg
   */
  protected async _handleParseInitFailed(arg: {
    model: IntegrationModel;
    runner: QueryRunner,
    err: string;
  }) {
    const { model, runner, err, } = arg;
    // reboot - wiping the init
    const serviceDto: IIntegrationServiceResetIntegrationDto = {
      error: err,
      public: `Failed to read init: ${err}`,
    };
    await this.ctx.services.integrationService.reset({
      model,
      runner,
      dto: serviceDto,
    });
    return model;
  }


  /**
   * Fired when parsing of state fails
   *
   * @param arg
   */
  protected async _handleParseStateFailed(arg: {
    model: IntegrationModel;
    runner: QueryRunner,
    err: string;
  }) {
    const { model, runner, err, } = arg;
    // reboot - wiping the init
    const serviceDto: IIntegrationServiceUpdateIntegrationDto = {
      init: null,
      state: null,
      is_connected: false,
      error: err,
      public: `Failed to read state: ${err}`,
    }
    await this.ctx.services.integrationService.update({ model, runner, dto: serviceDto });
    return err;
  }


  /**
   * Parse (decrypt & decode) encrypted init
   *
   * @param arg
   */
  protected _parseEncryptedInit(arg: {
    model: IntegrationModel;
    encrypted: string;
  }): E.Either<string, TGoogleInit> {
    const { encrypted, model } = arg;
    return P.pipe(
      // init exists - try decrypting & decoding
      E.tryCatch(
        () => this.ctx.services.integrationService.decrypt({ model, encrypted }),
        // decrypt failed
        (error) => `Failed to decrypt init: "${prettyQ(error)}"`,
      ),
      E.map(JSON.parse.bind(JSON)),
      E.chain(Fn.flow(
        TGoogleInit.decode,
        E.mapLeft(PR.failure),
        // decode failed
        E.mapLeft(errs => `Failed to decode init: \n${errs.join('\n')}`),
      )),
    );
  }


  /**
   * Parse (decrypt & decode) encrypted state
   *
   * @param arg
   */
  protected _parseEncryptedState(arg: {
    model: IntegrationModel;
    encrypted: string;
  }): E.Either<string, TGoogleState> {
    const { encrypted, model } = arg;
    return P.pipe(
      // init exists - try decrypting & decoding
      E.tryCatch(
        () => this.ctx.services.integrationService.decrypt({ model, encrypted }),
        // decrypt failed
        (error) => `Failed to decrypt state: "${prettyQ(error)}"`,
      ),
      E.map(JSON.parse.bind(JSON)),
      E.chain(Fn.flow(
        TGoogleState.decode,
        E.mapLeft(PR.failure),
        // decode failed
        E.mapLeft(errs => `Failed to decode state: \n${errs.join('\n')}`),
      )),
    );
  }


  /**
   * Read out credentials
   *
   * @param model
   */
  protected _readInit(arg: {
    runner: QueryRunner,
    model: IntegrationModel;
  }): Promise<TGoogleInit> {
    const { model, runner, } = arg;
    const program = P
      .pipe(
        model.encrypted_init,
        TE.fromPredicate(ist.notNullable, () => 'No init'),
        TE.chain((encrypted) => P.pipe(
          // exists - parse
          this._parseEncryptedInit({ encrypted, model }),
          TE.fromEither,
          // handle failure to parse
          TE.swap,
          TE.map(tap((err) => logger.warn(`Failed to parse Google integration init: ${err}`))),
          TE.chain((err) => TE.fromTask(() => this._handleParseInitFailed({ model, runner, err }).then(() => err))),
          TE.swap,
        )),
      );

    return program().then(unwrap.right);
  }


  /**
   * Read out token
   *
   * @param model
   */
  protected _readState(arg: {
    model: IntegrationModel;
    runner: QueryRunner;
  }): Promise<TGoogleState> {
    const { model, runner, } = arg;
    const program = P
      .pipe(
        model.encrypted_state,
        TE.fromPredicate(ist.notNullable, () => 'No state'),
        TE.chain((encrypted) => P.pipe(
          // exists - parse
          this._parseEncryptedState({ encrypted, model }),
          TE.fromEither,
          // handle failure to parse
          TE.swap,
          TE.map(tap((err) => logger.warn(`Failed to parse Google integration state: ${err}`))),
          TE.chain((err) => TE.fromTask(() => this._handleParseStateFailed({ model, runner, err }).then(() => err))),
          TE.swap,
        )),
      );

    return program().then(unwrap.right);
  }


  /**
   * Get init for the 
   */
  getIntegrationInit(arg: {
    dto: IIntegrationServiceInitialiseIntegrationCredentialsDto,
  }): TGoogleInit {
    const { dto } = arg;
    return {
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
      ],
      credentials: dto.init as $TS_FIX_ME<any>,
    }
    //
  }

  // scopes given by init
  // /**
  //  * Scopes
  //  */
  // protected get scopes(): string[] {
  //   const scopes = [
  //     'https://www.googleapis.com/auth/gmail.readonly',
  //     'https://www.googleapis.com/auth/gmail.send',
  //   ];
  //   return scopes;
  // }


  /**
   * Get a new client using the model
   *
   * @param arg
   */
  public async oauthClient(arg: {
    model: IntegrationModel;
    runner: QueryRunner;
  }): Promise<OAuth2Client> {
    const { model, runner } = arg;
    const init = await this._readInit({
      model,
      runner,
    });
    return new OAuth2Client(
      init.credentials.installed.client_id,
      init.credentials.installed.client_secret,
      init.credentials.installed.redirect_uris[0],
    );
  }


  /**
   * Get an OAuth2 url that will provide a code
   *
   * @param client
   */
  public async oauth2Url(arg: {
    model: IntegrationModel;
    client: OAuth2Client;
    runner: QueryRunner;
  }): Promise<string> {
    const { client, model, runner, } = arg;
    const init = await this._readInit({
      model,
      runner,
    });
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: init.scopes,
    });
    return url;
  }


  /**
   * Fired when an OAuth2 code is generated
   *
   * Use the OAuth2 code (provided by url from client.generateAuthUrl) to get a token
   *
   * @param arg
   */
  public async handleOAuth2Code(arg: {
    model: IntegrationModel,
    client: OAuth2Client;
    code: string;
    runner: QueryRunner,
  }): Promise<E.Either<string, TGoogleToken>> {
    const { model, client, code, runner, } = arg;

    const program = P.pipe(
      // use the code to retrieve a token
      TE.tryCatch(() => client.getToken(code), (error) => `Failed to get token: ${toString(error)}`),
      TE.chain(response => TE.fromEither(P.pipe(
        TGoogleToken.decode(response.tokens),
        E.mapLeft(PR.failure),
        E.mapLeft(errs => `Failed to decode token: \n${errs.join('\n')}`),
      ))),

      // on success - mark authentication as successful
      TE.map(tap(() => logger.info('Successfully authenticated Google integration'))),
      TE.chain((token) => TE.fromTask(async () => {
        const state: TGoogleState = { token: token, };
        const serviceDto: IIntegrationServiceUpdateIntegrationDto = {
          state,
          is_connected: true,
          error: null,
          public: 'Successfully authenticated',
        }
        await this.ctx.services.integrationService.update({ model, runner, dto: serviceDto });
        // authorize the given client
        client.setCredentials(token);
        return token;
      })),

      // on fail - mark authentication as unsuccessful
      TE.swap,
      TE.map(tap((err) => logger.warn(`Failed to authenticate Google integration: ${err}`))),
      TE.chain((error) => TE.fromTask(async () => {
        const serviceDto: IIntegrationServiceUpdateIntegrationDto = {
          state: null,
          is_connected: false,
          error,
          public: 'Failed to authenticate',
        }
        await this.ctx.services.integrationService.update({ model, runner, dto: serviceDto });
        return error;
      })),
      TE.swap
    );

    return program();
  }


  /**
   * Send an email using the integration
   *
   * @param arg
   */
  async sendEmail(arg: {
    runner: QueryRunner;
    model: IntegrationModel;
    dto: IGoogleIntegrationServiceSendEmailDto;
  }): Promise<gmail_v1.Schema$Message> {
    const { runner, model, dto, } = arg;

    const client = await this.oauthClient({ model, runner, });
    const state = await this._readState({ model, runner, });
    client.setCredentials(state.token);

    const options: gmail_v1.Options = {
      version: 'v1',
      auth: client,
    }

    const gmail = google.gmail(options);

    logger.info(`sending Gmail\nTo: ${dto.to.join(', ')}""\nCc: "${dto.cc?.join(', ')}"\nSubject: "${dto.subject}"\n...`);

    const rawMessage = Buffer.from([
      // to
      `To: ${dto.to.join(', ')} `,

      // cc
      ...(dto.cc?.length ? [`Cc: ${dto.cc.join(', ')} `] : []),

      // subject
      ...(ist.notNullable(dto.subject) ? [`Subject: ${dto.subject}`] : []),

      // `Date: Fri, 21 Nov 1997 09:55:06 -0600 `,
      // `Message-ID: <1234@local.machine.example>`,
      '',

      // body
      ...(ist.notNullable(dto.body) ? [dto.body] : []),
    ].join('\n'));

    const result = await gmail
      .users
      .messages
      .send(
        {
          userId: 'me',
          requestBody: {
            raw: rawMessage
              .toString('base64')
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
            ,
          },
        },
      );

    return result.data;
  }
}