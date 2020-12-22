import { UserModel } from "./user.model";
import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";

export const UserEmailLang = {
  CannotRequestWelcomeEmail: (arg: { model: UserModel }): LangSwitch => ({
    [Language.En]: `you cannot request-welcome-email for user ${arg.model.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotConsumeWelcomeToken: {
    [Language.En]: `you cannot consume-welcome-token for this user`,
    [Language.Ger]: '__TODO__',
  },

  CannotRequestVerificationEmail: {
    [Language.En]: `you cannot request-verification-email for this user`,
    [Language.Ger]: '__TODO__',
  },

  CannotConsumeVerificationToken: {
    [Language.En]: `you cannot consume-verification-token for this user`,
    [Language.Ger]: '__TODO__',
  },

  CannotConsumeEmailChangeVerificationToken: {
    [Language.En]: `you cannot consume-email-change-verification-token for this user`,
    [Language.Ger]: '__TODO__',
  },
 
  CannotRequestEmailChangeEmail: {
    [Language.En]: `you cannot request-email-change-email for this user`,
    [Language.Ger]: '__TODO__',
  },

  // ------------
  // Verify
  // ------------

  // Verify: subject
  VerificationSubject: (arg: { welcomeTo: string; name: string; }): LangSwitch => ({
    [Language.En]: `Verify Your Account`,
    [Language.Ger]: '__TODO__',
  }),

  // Verify: body
  VerificationBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }): LangSwitch => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `Visit this link ${arg.verifyUrl} to your account.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),

  // ------------
  // VerifyEmailChange
  // ------------

  // EmailChange: subject
  EmailChangeSubject: (arg: { welcomeTo: string; name: string; }): LangSwitch => ({
    [Language.En]: `Verify Email Address Change`,
    [Language.Ger]: '__TODO__',
  }),

  // EmailChange: body
  EmailChangeBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }): LangSwitch => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `Visit this link ${arg.verifyUrl} to your new email address.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),


  // ------------
  // Welcome
  // ------------

  // Welcome: subject
  WelcomeEmailSubject: (arg: { welcomeTo: string; name: string; }): LangSwitch => ({
    [Language.En]: `Welcome to ${arg.welcomeTo}`,
    [Language.Ger]: '__TODO__',
  }),

  // Welcome: body
  WelcomeEmailBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }): LangSwitch => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `Welcome to ${arg.welcomeTo}!`,
      '',
      `Visit this link ${arg.verifyUrl} to verify your account.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),

  // ------------
  // Registration
  // ------------

  // Registration: subject
  RegistrationEmailSubject: (arg: { welcomeTo: string; name: string; }): LangSwitch => ({
    [Language.En]: `Welcome to ${arg.welcomeTo}`,
    [Language.Ger]: '__TODO__',
  }),

  // Registration: body
  RegistrationEmailBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }): LangSwitch => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `Welcome to ${arg.welcomeTo}!`,
      '',
      `Visit this link ${arg.verifyUrl} to verify your account.`,
      '',
      `Enjoy your stay.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),

  // ------------
  // Password Reset
  // ------------

  // Password Reset: subject
  PasswordResetEmailSubject: (): LangSwitch => ({
    [Language.En]: `Reset Password`,
    [Language.Ger]: '__TODO__',
  }),

  // Password Reset: body
  PasswordResetEmailBody: (arg: { welcomeTo: string; resetUrl: string, name: string }): LangSwitch => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `your password has been reset`,
      '',
      `Visit this link ${arg.resetUrl} to enter a new password.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),
};