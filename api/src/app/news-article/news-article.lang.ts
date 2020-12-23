import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { NewsArticleModel } from "./news-article.model";

export const NewsArticleLang = {
  CannotFindMany: {
    [Language.En]: `you cannot view news-articles`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'news-article not found',
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access news-articles`,
    [Language.Ger]: '__TODO__',
  },

  CannotCreate: {
    [Language.En]: `you cannot create news-articles`,
    [Language.Ger]: '__TODO__',
  },

  CannotUpdate: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot update news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSoftDelete: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot restore news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSubmit: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot submit news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotReject: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot reject news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotApprove: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot approve news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotPublish: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot publish news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotUnpublish: (arg: { model: NewsArticleModel }): LangSwitch => ({
    [Language.En]: `you cannot unpublish news-article "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
};