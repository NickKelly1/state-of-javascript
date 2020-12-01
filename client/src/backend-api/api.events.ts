import { TsEvent } from "../helpers/ts-event";
import { IApiMe } from "./api.me";

export interface IApiEvents {
  authenticated: TsEvent<IApiMe>;
  unauthenticated: TsEvent<IApiMe>;

  log_out_start: TsEvent<undefined>;
  log_out_success: TsEvent<IApiMe>;
  log_out_fail: TsEvent<undefined>;

  log_in_start: TsEvent<undefined>;
  log_in_success: TsEvent<IApiMe>;
  log_in_fail: TsEvent<undefined>;

  register_start: TsEvent<undefined>;
  register_success: TsEvent<IApiMe>;
  register_fail: TsEvent<undefined>;

  verify_email_start: TsEvent<undefined>;
  verify_email_success: TsEvent<IApiMe>;
  verify_email_fail: TsEvent<undefined>;

  reset_password_start: TsEvent<undefined>;
  reset_password_success: TsEvent<IApiMe>;
  reset_password_fail: TsEvent<undefined>;

  refresh_start: TsEvent<undefined>;
  refresh_success: TsEvent<IApiMe>;
  refresh_fail: TsEvent<undefined>;

  accept_welcome_start: TsEvent<undefined>;
  accept_welcome_success: TsEvent<IApiMe>;
  accept_welcome_fail: TsEvent<undefined>;

  verify_email_change_start: TsEvent<undefined>;
  verify_email_change_success: TsEvent<IApiMe>;
  verify_email_change_fail: TsEvent<undefined>;

  force_out_start: TsEvent<undefined>;
  force_out_success: TsEvent<IApiMe>;
  force_out_fail: TsEvent<undefined>;
}

export const ApiEventsFactory = (): IApiEvents => ({
  authenticated: new TsEvent<IApiMe>(),
  unauthenticated: new TsEvent<IApiMe>(),

  log_out_start: new TsEvent<undefined>(),
  log_out_success: new TsEvent<IApiMe>(),
  log_out_fail: new TsEvent<undefined>(),

  log_in_start: new TsEvent<undefined>(),
  log_in_success: new TsEvent<IApiMe>(),
  log_in_fail: new TsEvent<undefined>(),

  register_start: new TsEvent<undefined>(),
  register_success: new TsEvent<IApiMe>(),
  register_fail: new TsEvent<undefined>(),

  verify_email_start: new TsEvent<undefined>(),
  verify_email_success: new TsEvent<IApiMe>(),
  verify_email_fail: new TsEvent<undefined>(),

  reset_password_start: new TsEvent<undefined>(),
  reset_password_success: new TsEvent<IApiMe>(),
  reset_password_fail: new TsEvent<undefined>(),

  refresh_start: new TsEvent<undefined>(),
  refresh_success: new TsEvent<IApiMe>(),
  refresh_fail: new TsEvent<undefined>(),

  accept_welcome_start: new TsEvent<undefined>(),
  accept_welcome_success: new TsEvent<IApiMe>(),
  accept_welcome_fail: new TsEvent<undefined>(),

  verify_email_change_start: new TsEvent<undefined>(),
  verify_email_change_success: new TsEvent<IApiMe>(),
  verify_email_change_fail: new TsEvent<undefined>(),

  force_out_start: new TsEvent<undefined>(),
  force_out_success: new TsEvent<IApiMe>(),
  force_out_fail: new TsEvent<undefined>(),
});