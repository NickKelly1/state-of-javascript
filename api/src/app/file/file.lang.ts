import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { FileModel } from "./file.model";

export const FileLang = {
  NotFound: {
    [Language.En]: 'file not found',
    [Language.Ger]: '__TODO__',
  },
  NoExtensionForMimtype: (arg: { mimetype: string }): LangSwitch => ({
    [Language.En]: `No extension found for mimetype "${arg.mimetype}"`,
    [Language.Ger]: '__TODO__',
  }),
  // CannotAccess: {
  //   [Language.En]: `you cannot access files`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotFindMany: {
  //   [Language.En]: `you cannot view files`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotCreate: {
  //   [Language.En]: `you cannot create files`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotCreateForBlogPost: {
  //   [Language.En]: `you cannot create files for this blog-post`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotUpdate: (arg: { model: FileModel }): LangSwitch => ({
  //   [Language.En]: `you cannot update this file`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotSoftDelete: (arg: { model: FileModel }): LangSwitch => ({
  //   [Language.En]: `you cannot soft-delete this file`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotHardDelete: (arg: { model: FileModel }): LangSwitch => ({
  //   [Language.En]: `you cannot hard-delete this file`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotRestore: (arg: { model: FileModel }): LangSwitch => ({
  //   [Language.En]: `you cannot restore this file`,
  //   [Language.Ger]: '__TODO__',
  // }),
};