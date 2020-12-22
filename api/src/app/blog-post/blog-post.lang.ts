import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { BlogPostModel } from "./blog-post.model";

export const BlogPostLang = {
  NotFound: {
    [Language.En]: 'blog-post not found',
    [Language.Ger]: '__TODO__',
  },
  CannotAccess: {
    [Language.En]: `you access blog-posts`,
    [Language.Ger]: '__TODO__',
  },
  CannotFindMany: {
    [Language.En]: `you cannot view blog-posts`,
    [Language.Ger]: '__TODO__',
  },
  CannotCreate: {
    [Language.En]: `you cannot create blog-posts`,
    [Language.Ger]: '__TODO__',
  },
  CannotUpdate: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot update blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotSoftDelete: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotHardDelete: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotRestore: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot restore blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotSubmit: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot submit blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotReject: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot reject blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotApprove: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot approve blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotPublish: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot publish blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
  CannotUnpublish: (arg: { model: BlogPostModel }): LangSwitch => ({
    [Language.En]: `you cannot unpublish blog-post "${arg.model.title}"`,
    [Language.Ger]: '__TODO__',
  }),
};