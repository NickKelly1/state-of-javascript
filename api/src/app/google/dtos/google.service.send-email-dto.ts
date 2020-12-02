import { OrNull } from "../../../common/types/or-null.type";

export interface IGoogleIntegrationServiceSendEmailDto {
  to: string[];
  cc?: OrNull<string[]>;
  subject?: OrNull<string>;
  body?: OrNull<string>;
}
