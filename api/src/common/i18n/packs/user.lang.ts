import { Language } from "../consts/language.enum";

export const UserLang = {
  EmailTaken: (arg: { email: string }) => ({
    [Language.En]: `"${arg.email}" is in use`,
    [Language.Ger]: '__TODO__',
  }),

  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `user "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenAddingRoles: (arg: { userName: string, roleNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to add roles of user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenDeletingRoles: (arg: { userName: string, roleNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to delete roles from user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),


  FailedToCreate: {
    [Language.En]: 'failed to create user',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update user',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'user not found',
    [Language.Ger]: '__TODO__',
  },

  // ------------
  // VerifyEmailChange
  // ------------

  // Welcome: subject
  VerifyEmailChangeSubject: (arg: { welcomeTo: string; name: string; }) => ({
    [Language.En]: `Verify Email address change`,
    [Language.Ger]: '__TODO__',
  }),

  // Welcome: body
  VerifyEmailChangeBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }) => ({
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
  WelcomeEmailSubject: (arg: { welcomeTo: string; name: string; }) => ({
    [Language.En]: `Welcome to ${arg.welcomeTo}`,
    [Language.Ger]: '__TODO__',
  }),

  // Welcome: body
  WelcomeEmailBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }) => ({
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
  RegistrationEmailSubject: (arg: { welcomeTo: string; name: string; }) => ({
    [Language.En]: `Welcome to ${arg.welcomeTo}`,
    [Language.Ger]: '__TODO__',
  }),

  // Registration: body
  RegistrationEmailBody: (arg: { welcomeTo: string; verifyUrl: string, name: string }) => ({
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
  PasswordResetEmailSubject: () => ({
    [Language.En]: `Password reset`,
    [Language.Ger]: '__TODO__',
  }),

  // Password Reset: body
  PasswordResetEmailBody: (arg: { welcomeTo: string; resetUrl: string, name: string }) => ({
    [Language.En]: [
      `Hi ${arg.name},`,
      '',
      `Your password has been reset`,
      '',
      `Visit this link ${arg.resetUrl} to enter a new password.`,
    ].join('\n'),
    [Language.Ger]: '__TODO__',
  }),
};