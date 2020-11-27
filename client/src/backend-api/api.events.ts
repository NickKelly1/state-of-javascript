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

  refresh_start: TsEvent<undefined>;
  refresh_success: TsEvent<ApiMe>;
  refresh_fail: TsEvent<undefined>;
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

  refresh_start: new TsEvent<undefined>(),
  refresh_success: new TsEvent<ApiMe>(),
  refresh_fail: new TsEvent<undefined>(),
});