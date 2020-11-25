import { OrNull } from "../../common/types/or-null.type";

export interface IGmailJob {
  to: string[];
  cc: OrNull<string[]>;
  subject: OrNull<string>;
  body: OrNull<string>;
}
