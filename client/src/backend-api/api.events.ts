import { TsEvent } from "../helpers/ts-event";
import { ApiMe } from "./api.me";

export interface IApiEvents {
  authenticated: TsEvent<ApiMe>;
  unauthenticated: TsEvent<ApiMe>;

  log_out_start: TsEvent<undefined>;
  log_out_success: TsEvent<ApiMe>;
  log_out_fail: TsEvent<undefined>;

  log_in_start: TsEvent<undefined>;
  log_in_success: TsEvent<ApiMe>;
  log_in_fail: TsEvent<undefined>;

  register_start: TsEvent<undefined>;
  register_success: TsEvent<ApiMe>;
  register_fail: TsEvent<undefined>;

  verify_email_start: TsEvent<undefined>;
  verify_email_success: TsEvent<ApiMe>;
  verify_email_fail: TsEvent<undefined>;

  reset_password_start: TsEvent<undefined>;
  reset_password_success: TsEvent<ApiMe>;
  reset_password_fail: TsEvent<undefined>;

  refresh_start: TsEvent<undefined>;
  refresh_success: TsEvent<ApiMe>;
  refresh_fail: TsEvent<undefined>;

  accept_welcome_start: TsEvent<undefined>;
  accept_welcome_success: TsEvent<ApiMe>;
  accept_welcome_fail: TsEvent<undefined>;

  verify_email_change_start: TsEvent<undefined>;
  verify_email_change_success: TsEvent<ApiMe>;
  verify_email_change_fail: TsEvent<undefined>;

  force_out_start: TsEvent<undefined>;
  force_out_success: TsEvent<ApiMe>;
  force_out_fail: TsEvent<undefined>;
}

export const ApiEventsFactory = (): IApiEvents => ({
  authenticated: new TsEvent<ApiMe>(),
  unauthenticated: new TsEvent<ApiMe>(),

  log_out_start: new TsEvent<undefined>(),
  log_out_success: new TsEvent<ApiMe>(),
  log_out_fail: new TsEvent<undefined>(),

  log_in_start: new TsEvent<undefined>(),
  log_in_success: new TsEvent<ApiMe>(),
  log_in_fail: new TsEvent<undefined>(),

  register_start: new TsEvent<undefined>(),
  register_success: new TsEvent<ApiMe>(),
  register_fail: new TsEvent<undefined>(),

  verify_email_start: new TsEvent<undefined>(),
  verify_email_success: new TsEvent<ApiMe>(),
  verify_email_fail: new TsEvent<undefined>(),

  reset_password_start: new TsEvent<undefined>(),
  reset_password_success: new TsEvent<ApiMe>(),
  reset_password_fail: new TsEvent<undefined>(),

  refresh_start: new TsEvent<undefined>(),
  refresh_success: new TsEvent<ApiMe>(),
  refresh_fail: new TsEvent<undefined>(),

  accept_welcome_start: new TsEvent<undefined>(),
  accept_welcome_success: new TsEvent<ApiMe>(),
  accept_welcome_fail: new TsEvent<undefined>(),

  verify_email_change_start: new TsEvent<undefined>(),
  verify_email_change_success: new TsEvent<ApiMe>(),
  verify_email_change_fail: new TsEvent<undefined>(),

  force_out_start: new TsEvent<undefined>(),
  force_out_success: new TsEvent<ApiMe>(),
  force_out_fail: new TsEvent<undefined>(),
});