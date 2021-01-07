import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { ImageModel } from "./image.model";

export const ImageLang = {
  NotFound: {
    [Language.En]: 'image not found',
    [Language.Ger]: '__TODO__',
  },
  // CannotAccess: {
  //   [Language.En]: `you cannot access images`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotFindMany: {
  //   [Language.En]: `you cannot view images`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotCreate: {
  //   [Language.En]: `you cannot create images`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotCreateForBlogPost: {
  //   [Language.En]: `you cannot create images for this blog-post`,
  //   [Language.Ger]: '__TODO__',
  // },
  // CannotUpdate: (arg: { model: ImageModel }): LangSwitch => ({
  //   [Language.En]: `you cannot update this image`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotSoftDelete: (arg: { model: ImageModel }): LangSwitch => ({
  //   [Language.En]: `you cannot soft-delete this image`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotHardDelete: (arg: { model: ImageModel }): LangSwitch => ({
  //   [Language.En]: `you cannot hard-delete this image`,
  //   [Language.Ger]: '__TODO__',
  // }),
  // CannotRestore: (arg: { model: ImageModel }): LangSwitch => ({
  //   [Language.En]: `you cannot restore this image`,
  //   [Language.Ger]: '__TODO__',
  // }),
};