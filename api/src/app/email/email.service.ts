import { BaseContext } from "../../common/context/base.context";
import nodemailer, { createTransport } from 'nodemailer';
// import SMTPTransport = require('./lib/smtp-transport');
import SMTPTransport, { Options as SMTPTransportOptions, MailOptions, SentMessageInfo } from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import { OrNull } from "../../common/types/or-null.type";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";

export interface IEmailServiceSendOptions {
  to: OrNull<string | string[]>;
  cc: OrNull<string | string[]>;
  subject: OrNull<string>;
  text: OrNull<string>;
}

// TODO....
export class EmailService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Mail instance
   */
  protected _mail: OrNull<Mail> = null;
  protected get mail(): Mail {
    if (this._mail) return this._mail;
    const user = this.ctx.services.universal.env.MAIL_USERNAME;
    const pass = this.ctx.services.universal.env.MAIL_PASSWORD;
    const port = this.ctx.services.universal.env.MAIL_PORT;
    const host = this.ctx.services.universal.env.MAIL_HOST;
    const encryption = this.ctx.services.universal.env.MAIL_ENCRYPTION;
    const options: SMTPTransportOptions = {
      host,
      port,
      auth: { user, pass, },
    };
    if (encryption === 'tls') {
      options.requireTLS = true;
      options.tls = { rejectUnauthorized: true, };
    }
    logger.info('Creating mail transport...')
    this._mail = createTransport(options);
    return this._mail;
  }


  /**
   * Send an email
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async send(arg: {
    dto: IEmailServiceSendOptions,
  }): Promise<SentMessageInfo> {
    const { dto, } = arg;
    const { subject, cc, text, to } = dto;
    logger.info(`[${this.constructor.name}::send] Sending email... ${prettyQ(dto)}`);
    const result: SentMessageInfo = await this.mail.sendMail({
      from: this.ctx.services.universal.env.MAIL_FROM,
      to: to ?? undefined,
      cc: cc ?? undefined,
      subject: subject ?? undefined,
      text: text ?? undefined,
    });
    return result;
  }
}
