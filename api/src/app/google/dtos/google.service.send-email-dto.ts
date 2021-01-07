import { OrNull } from "../../../common/types/or-null.type";

export interface IGoogleServiceSendEmailDto {
  to: string[];
  cc?: OrNull<string[]>;
  subject?: OrNull<string>;
  body?: OrNull<string>;
}
