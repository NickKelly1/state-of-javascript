import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { createTransport } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from 'googleapis';

// TODO....
export class EmailService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }
}
