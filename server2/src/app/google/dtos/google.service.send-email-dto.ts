
export interface IGoogleIntegrationServiceSendEmailDto {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
}
