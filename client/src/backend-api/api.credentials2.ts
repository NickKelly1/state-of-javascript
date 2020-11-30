import { Mutex, } from 'async-mutex';
import { gql, GraphQLClient, } from 'graphql-request';
import { shad_id } from '../constants/shad-id.const';
import { Debug } from '../debug/debug';
import { PublicEnv } from '../env/public-env.helper';
import {
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
  RefreshMutation,
  RefreshMutationVariables,
  RegisterMutationVariables,
  RegisterMutation,
  ActionsQuery,
  ActionsQueryVariables,
  ConsumeEmailVerificationMutation,
  ConsumeEmailVerificationMutationVariables,
  ConsumeResetPasswordMutation,
  ConsumeResetPasswordMutationVariables,
  ConsumeUserWelcomeMutation,
  ConsumeUserWelcomeMutationVariables,
  ConsumeEmailChangeVerificationMutation,
  ConsumeEmailChangeVerificationMutationVariables,
} from '../generated/graphql';
import { ist } from '../helpers/ist.helper';
import { IApiEvents } from './api.events';


/**
 * AuthorisedActionsFields Fragment
 */
export const authorisedActionsFieldsFragment = gql`
fragment AuthorisedActionsFields on ActionsNode {
  users{
    show
    login
    register
    create
    logout
  }
  roles{
    show
    create
  }
  userRoles{
    show
  }
  permissions{
    show
  }
  rolePermissions{
    show
  }
  npmsPackages{
    show
    create
  }
  npmsDashboards{
    show
    sort
    create
  }
  npmsDashboardItems{
    show
  }
  newsArticles{
    show
    create
  }
  newsArticleStatuses{
    show
  }
  jobs{
    show
  }
  logs{
    show
  }
  integrations{
    show
    initialise
  }
}
`;

/**
 * AuthenticationFields Fragment
 */
export const authenticationFieldsFragment = gql`
fragment AuthenticationFields on AuthenticationNode {
  user_id
  user_name
  access_token
  access_token_object{
    data{
      permissions
    }
  }
  refresh_token
  can{
    ...AuthorisedActionsFields
  }
}
${authorisedActionsFieldsFragment}
`;

const actionsQuery = gql`
query Actions {
  can{
    ...AuthorisedActionsFields
  }
}
${authorisedActionsFieldsFragment}
`;

/**
 * Logout
 */
const logoutMutation = gql`
mutation Logout{
  logout{
    can{
      ...AuthorisedActionsFields
    }
  }
}
${authorisedActionsFieldsFragment}
`;

/**
 * Refresh
 */
const refreshMutation = gql`
mutation Refresh(
  $refresh_token:String
){
  refresh(
    dto:{
      refresh_token:$refresh_token
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`

const loginMutation = gql`
mutation Login(
  $name_or_email:String!
  $password:String!
){
  login(
    dto:{
      name_or_email:$name_or_email
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`


/**
 * Register
 */
const registerMutation = gql`
mutation Register(
  $name:String!
  $email:String!
  $password:String!
){
  register(
    dto:{
      name:$name
      email:$email
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`

/**
 * Consume Verify Email
 */
const consumeEmailVerificationMutation = gql`
mutation ConsumeEmailVerification(
  $token:String!
){
  consumeEmailVerification(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * Password Reset
 */
const consumeResetPasswordMutation = gql`
mutation ConsumeResetPassword(
  $token:String!
  $password:String!
){
  consumeForgottenUserPasswordReset(
    dto:{
      token:$token
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * Accept Welcome
 */
const consumeUserWelcomeMutation = gql`
mutation ConsumeUserWelcome(
  $token:String!
  $name:String!
  $password:String!
){
  consumeUserWelcome(
    dto:{
      token:$token
      name:$name
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * VerifyEmailChange
 */
const consumeEmailChangeVerification = gql`
mutation ConsumeEmailChangeVerification(
  $token:String!
){
  consumeEmailChangeVerification(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

// export enum ApiCredentialsFactoryArgType {
//   WithMe,
//   WithCredentials,
//   WithoutCredentials,
// }

// type IApiCredentialsFactoryArgWithMe = {
//   type: ApiCredentialsFactoryArgType.WithMe
//   me: ApiMe;
//   publicEnv: PublicEnv,
//   credentialedGqlClient: GraphQLClient,
//   uncredentialedGqlClient: GraphQLClient,
//   refreshGqlClient: GraphQLClient,
//   event: IApiEvents,
// };
// type IApiCredentialsFactoryArgWithCredentials = {
//   type: ApiCredentialsFactoryArgType.WithCredentials
//   me: undefined;
//   publicEnv: PublicEnv,
//   credentialedGqlClient: GraphQLClient,
//   uncredentialedGqlClient: GraphQLClient,
//   refreshGqlClient: GraphQLClient,
//   event: IApiEvents,
// };
// type IApiCredentialsFactoryArgWithoutCredentials = {
//   type: ApiCredentialsFactoryArgType.WithoutCredentials
//   me: undefined;
//   publicEnv: PublicEnv,
//   credentialedGqlClient: GraphQLClient,
//   uncredentialedGqlClient: GraphQLClient,
//   refreshGqlClient: GraphQLClient,
//   event: IApiEvents,
// };

// export type IApiCredentialsFactoryArg =
//   | IApiCredentialsFactoryArgWithMe
//   | IApiCredentialsFactoryArgWithCredentials
//   | IApiCredentialsFactoryArgWithoutCredentials;

// /**
//  * Create ApiCredentials
//  *
//  * @param arg
//  */
// export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithMe): ApiCredentials
// export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithCredentials): Promise<ApiCredentials>
// export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithoutCredentials): Promise<ApiCredentials>
// export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArg): ApiCredentials | Promise<ApiCredentials> {

//   switch (arg.type) {

//     // with me
//     case ApiCredentialsFactoryArgType.WithMe: {
//       const {
//         me,
//         credentialedGqlClient,
//         publicEnv,
//         uncredentialedGqlClient,
//         refreshGqlClient,
//         event,
//       } = arg;
//       const creds = new ApiCredentials(
//         publicEnv,
//         credentialedGqlClient,
//         uncredentialedGqlClient,
//         refreshGqlClient,
//         event,
//         me,
//       );
//       return creds;
//     }

//     // with credentials
//     case ApiCredentialsFactoryArgType.WithCredentials: {
//       const {
//         credentialedGqlClient,
//         publicEnv,
//         uncredentialedGqlClient,
//         refreshGqlClient,
//         event,
//       } = arg;
//       const vars: RefreshMutationVariables = {};
//       return refreshGqlClient
//         .request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars)
//         .then(result => {
//           const me = ApiMeFactory({ authenticated: true, value: result.refresh });
//           const creds = new ApiCredentials(
//             publicEnv,
//             credentialedGqlClient,
//             uncredentialedGqlClient,
//             refreshGqlClient,
//             event,
//             me,
//           );
//           return creds;
//         });
//     }

//     // without credentials
//     case ApiCredentialsFactoryArgType.WithoutCredentials: {
//       const {
//         credentialedGqlClient,
//         publicEnv,
//         uncredentialedGqlClient,
//         refreshGqlClient,
//         event,
//       } = arg;
//       const vars: ActionsQueryVariables = {};
//       return uncredentialedGqlClient
//         .request<ActionsQuery, ActionsQueryVariables>(actionsQuery, vars)
//         .then(result => {
//           const me = ApiMeFactory({ authenticated: false, value: result.can });
//           const creds = new ApiCredentials(
//             publicEnv,
//             credentialedGqlClient,
//             uncredentialedGqlClient,
//             refreshGqlClient,
//             event,
//             me,
//           );
//           return creds;
//         });
//     }


//     default: {
//       // @ts-expect-error
//       throw new Error(`Unhandled type: "${(arg).type}"`);
//     }
//   }
// }

// export interface IGraphQLClientWrapper {
//   me: ApiMe;
//   credentialed: boolean;
//   client: GraphQLClient;
// }

// export interface IApiCredentialsLoginArg {
//   name_or_email: string;
//   password: string;
// }


// export interface IApiCredentialsRegisterArg {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface IApiCredentialsVerifyEmailArg {
//   token: string;
// }

// export interface IApiCredentialsResetPasswordArg {
//   token: string;
//   password: string;
// }

// export interface IApiCredentialsConsumeUserWelcomeArg {
//   token: string;
//   name: string;
//   password: string;
// }

// export interface IApiCredentialsConsumeChangeVerificationArg {
//   token: string;
// }


// const credentialsFns = {
//   //
// };

// export class ApiCredentials {
//   // protected readonly syncLock: Mutex = new Mutex();
//   protected readonly authenticationLock: Mutex = new Mutex();

//   get me(): ApiMe { return this._me; }

//   constructor(
//     protected readonly publicEnv: PublicEnv,
//     protected readonly credentialedGqlClient: GraphQLClient,
//     protected readonly uncredentialedGqlClient: GraphQLClient,
//     protected readonly refreshGqlClient: GraphQLClient,
//     protected readonly event: IApiEvents,
//     protected _me: ApiMe,
//   ) {
//     this.event.authenticated.on(() => { Debug.ApiCredentials('on::authenticated'); });
//     this.event.unauthenticated.on(() => { Debug.ApiCredentials('on::unauthenticated'); });

//     this.event.log_in_start.on(() => { Debug.ApiCredentials('on::log_in_start'); });
//     this.event.log_in_success.on(() => { Debug.ApiCredentials('on::log_in_success'); });
//     this.event.log_in_fail.on(() => { Debug.ApiCredentials('on::log_in_fail'); });

//     this.event.log_out_start.on(() => { Debug.ApiCredentials('on::log_out_start'); });
//     this.event.log_out_success.on(() => { Debug.ApiCredentials('on::log_out_success'); });
//     this.event.log_out_fail.on(() => { Debug.ApiCredentials('on::log_out_fail'); });

//     this.event.register_start.on(() => { Debug.ApiCredentials('on::register_start'); });
//     this.event.register_success.on(() => { Debug.ApiCredentials('on::register_success'); });
//     this.event.register_fail.on(() => { Debug.ApiCredentials('on::register_fail'); });

//     this.event.verify_email_start.on(() => { Debug.ApiCredentials('on::verify_email_start'); });
//     this.event.verify_email_success.on(() => { Debug.ApiCredentials('on::verify_email_success'); });
//     this.event.verify_email_fail.on(() => { Debug.ApiCredentials('on::verify_email_fail'); });

//     this.event.reset_password_start.on(() => { Debug.ApiCredentials('on::reset_password_start'); });
//     this.event.reset_password_success.on(() => { Debug.ApiCredentials('on::reset_password_success'); });
//     this.event.reset_password_fail.on(() => { Debug.ApiCredentials('on::reset_password_fail'); });

//     this.event.refresh_start.on(() => { Debug.ApiCredentials('on::refresh_start'); });
//     this.event.refresh_success.on(() => { Debug.ApiCredentials('on::refresh_success'); });
//     this.event.refresh_fail.on(() => { Debug.ApiCredentials('on::refresh_fail'); });

//     this.event.accept_welcome_start.on(() => { Debug.ApiCredentials('on::accept_welcome_start'); });
//     this.event.accept_welcome_success.on(() => { Debug.ApiCredentials('on::accept_welcome_success'); });
//     this.event.accept_welcome_fail.on(() => { Debug.ApiCredentials('on::accept_welcome_fail'); });

//     this.event.verify_email_change_start.on(() => { Debug.ApiCredentials('on::verify_email_change_start'); });
//     this.event.verify_email_change_success.on(() => { Debug.ApiCredentials('on::verify_email_change_success'); });
//     this.event.verify_email_change_fail.on(() => { Debug.ApiCredentials('on::verify_email_change_fail'); });

//     this.event.force_out_start.on(() => { Debug.ApiCredentials('on::force_out_start'); });
//     this.event.force_out_success.on(() => { Debug.ApiCredentials('on::force_out_success'); });
//     this.event.force_out_fail.on(() => { Debug.ApiCredentials('on::force_out_fail'); });

//     // set shadow user...
//     if (!!this._me.shad_id) {
//       this.uncredentialedGqlClient.setHeader(shad_id, this._me.shad_id);
//     }
//     else {
//       this.uncredentialedGqlClient.setHeader(shad_id, '');
//     }

//     // set authenticated user
//     if (ist.defined(this._me.user)) {
//       this.credentialedGqlClient.setHeader('Authorization', `Bearer ${this._me.user.access_token}`);
//       this.refreshGqlClient.setHeader('refresh_token', this._me.user.refresh_token);
//     }
//   }


//   /**
//    * Am I authenticated?
//    */
//   isAuthenticated(): boolean {
//     return this._me.isAuthenticated;
//   }


//   /**
//    * Is Authenticating / Unauthenticaing
//    */
//   isRunning() {
//     return this.authenticationLock.isLocked();
//   }


//   /**
//    * Wait for everything to be settled and get me...
//    */
//   async getSafeMe(): Promise<ApiMe> {
//     // wait for lock to settle & get me
//     const unlock = await this.authenticationLock.acquire();
//     const me = this._me;
//     unlock();
//     return me;
//   }


//   /**
//    * Save the authentication
//    *
//    * @param me
//    */
//   protected _saveAuthentication(me: ApiMe): void {
//     this._me = me;
//     // set authentication for requests
//     if (ist.defined(this._me.user)) {
//       this.credentialedGqlClient.setHeader('Authorization', `Bearer ${this._me.user.access_token}`);
//       this.refreshGqlClient.setHeader('refresh_token', this._me.user.refresh_token);
//     }
//     this.event.authenticated.fire(me);
//   }


//   /**
//    * Remove the authentication
//    */
//   protected _removeAuthentication(me: ApiMe): void {
//     this._me = me;
//     if (!!this._me.shad_id) {
//       this.uncredentialedGqlClient.setHeader(shad_id, this._me.shad_id);
//     }
//     else {
//       this.uncredentialedGqlClient.setHeader(shad_id, '');
//     }
//     // clear other authorisation
//     // we will remove the refresh_token too so that when refreshing the cookies refresh_token, not the headers
//     this.credentialedGqlClient.setHeader('Authorization', 'Bearer ');
//     this.refreshGqlClient.setHeader('refresh_token', '');
//     this.event.unauthenticated.fire(me);
//   }


//   /**
//    * Wait for everything to be settled & then get a Client
//    */
//   async getSafeRequester(): Promise<IGraphQLClientWrapper> {
//     const unlock = await this.authenticationLock.acquire();
//     const me = this._me;
//     unlock();
//     if (me.isAuthenticated) {
//       return {
//         me,
//         credentialed: true,
//         client: this.credentialedGqlClient,
//       }
//     }
//     return {
//       me,
//       credentialed: false,
//       client: this.uncredentialedGqlClient,
//     }
//   }


//   /**
//    * Force out
//    *
//    *  1. Want to handle login / logout routes with GraphQL
//    *  2. Authentication can
//    *  3. ... todo
//    */
//   async _unlockedForceOut(): Promise<ActionsQuery> {
//     try {
//       this.event.force_out_start.fire(undefined);
//       const vars: ActionsQueryVariables = {};
//       const result = await this
//         .uncredentialedGqlClient
//         .request<ActionsQuery>(actionsQuery, vars);
//       const meOut = ApiMeFactory({
//         authenticated: false,
//         value: result.can,
//       });
//       this._removeAuthentication(meOut);
//       this.event.force_out_success.fire(meOut);
//       return result;
//     } catch (error) {
//       this.event.force_out_fail.fire(undefined);
//       throw error;
//     }
//   }


//   /**
//    * Logout
//    */
//   async _unlockedLogout(): Promise<LogoutMutation> {
//     try {
//       this.event.log_out_start.fire(undefined);
//       const logoutVars: LogoutMutationVariables = {};
//       // remove credentials before attempting log-out
//       // otherwise, if credentials are kept but stale, they will be 401'd by the server
//       this.credentialedGqlClient.setHeader('Authorization', 'Bearer ');
//       this.refreshGqlClient.setHeader('refresh_token', '');
//       const logoutResult = await this
//         .credentialedGqlClient
//         .request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
//       const meOut = ApiMeFactory({ authenticated: false, value: logoutResult.logout.can });
//       this._removeAuthentication(meOut);
//       this.event.log_out_success.fire(meOut);
//       return logoutResult;
//     } catch(error) {
//       this.event.log_out_fail.fire(undefined);
//       await this._unlockedForceOut().catch();
//       throw error;
//     }
//   }


//   /**
//    * Refresh authentication
//    */
//   async refresh(): Promise<RefreshMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.refresh_start.fire(undefined);
//       const vars: RefreshMutationVariables = {};
//       const result = await this
//         .refreshGqlClient
//         .request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars);
//       const me = ApiMeFactory({ authenticated: true, value: result.refresh });
//       this._saveAuthentication(me);
//       this.event.refresh_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.refresh_fail.fire(undefined);
//       await this._unlockedLogout().catch();
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Login
//    */
//   async login(arg: IApiCredentialsLoginArg): Promise<LoginMutation> {
//     const { name_or_email, password } = arg;
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.log_in_start.fire(undefined);
//       const vars: LoginMutationVariables = {
//         name_or_email,
//         password,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<LoginMutation, LoginMutationVariables>(
//           loginMutation,
//           vars,
//         );
//       const me = ApiMeFactory({ authenticated: true, value: result.login });
//       this._saveAuthentication(me);
//       this.event.log_in_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.log_in_fail.fire(undefined);
//       await this._unlockedLogout().catch();
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Register
//    */
//   async register(arg: IApiCredentialsRegisterArg): Promise<RegisterMutation> {
//     const { name, email, password } = arg;
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.register_start.fire(undefined);
//       const vars: RegisterMutationVariables = {
//         name,
//         email,
//         password,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<RegisterMutation, RegisterMutationVariables>(
//           registerMutation,
//           vars,
//         );
//       const me = ApiMeFactory({ authenticated: true, value: result.register });
//       this._saveAuthentication(me);
//       this.event.register_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.register_fail.fire(undefined);
//       await this._unlockedLogout().catch();
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Logout
//    */
//   async logout(): Promise<LogoutMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       const result = await this._unlockedLogout();
//       return result;
//     }
//     catch (error) {
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Consume EmailVerification
//    */
//   async consumeEmailVerification(arg: IApiCredentialsVerifyEmailArg): Promise<ConsumeEmailVerificationMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.verify_email_start.fire(undefined);
//       const vars: ConsumeEmailVerificationMutationVariables = {
//         token: arg.token,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<ConsumeEmailVerificationMutation, ConsumeEmailVerificationMutationVariables>(
//           consumeEmailVerificationMutation,
//           vars,
//         );
//       const me = ApiMeFactory({ authenticated: true, value: result.consumeEmailVerification });
//       this._saveAuthentication(me);
//       this.event.verify_email_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.verify_email_fail.fire(undefined);
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Consume ResetPassword
//    */
//   async consumeResetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ConsumeResetPasswordMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.reset_password_start.fire(undefined);
//       const vars: ConsumeResetPasswordMutationVariables = {
//         token: arg.token,
//         password: arg.password,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<ConsumeResetPasswordMutation, ConsumeResetPasswordMutationVariables>(
//           consumeResetPasswordMutation,
//           vars,
//         );
//       const me = ApiMeFactory({ authenticated: true, value: result.consumeForgottenUserPasswordReset });
//       this._saveAuthentication(me);
//       this.event.reset_password_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.reset_password_fail.fire(undefined);
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Consume UserWelcome
//    */
//   async consumeUserWelcome(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeUserWelcomeMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.accept_welcome_start.fire(undefined);
//       const vars: ConsumeUserWelcomeMutationVariables = {
//         token: arg.token,
//         name: arg.name,
//         password: arg.password,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<ConsumeUserWelcomeMutation, ConsumeUserWelcomeMutationVariables>(consumeUserWelcomeMutation, vars);
//       const me = ApiMeFactory({ authenticated: true, value: result.consumeUserWelcome });
//       this._saveAuthentication(me);
//       this.event.accept_welcome_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.accept_welcome_fail.fire(undefined);
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }


//   /**
//    * Consume EmailChangeVerification
//    */
//   async consumeEmailChangeVerification(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeVerificationMutation> {
//     const release = await this.authenticationLock.acquire();
//     try {
//       this.event.verify_email_change_start.fire(undefined);
//       const vars: ConsumeEmailChangeVerificationMutationVariables = {
//         token: arg.token,
//       };
//       const result = await this
//         .credentialedGqlClient
//         .request<ConsumeEmailChangeVerificationMutation, ConsumeEmailChangeVerificationMutationVariables>(
//           consumeEmailChangeVerification,
//           vars,
//         );
//       const me = ApiMeFactory({ authenticated: true, value: result.consumeEmailChangeVerification });
//       this._saveAuthentication(me);
//       this.event.verify_email_change_success.fire(me);
//       return result;
//     }
//     catch (error) {
//       this.event.verify_email_change_fail.fire(undefined);
//       throw error;
//     }
//     finally {
//       release();
//     }
//   }
// }
