import { OrNull } from "../../common/types/or-null.type";

export interface IEmailjob {
  to: string[];
  cc: OrNull<string[]>;
  subject: OrNull<string>;
  body: OrNull<string>;
}
