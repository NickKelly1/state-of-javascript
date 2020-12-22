import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { BlogPostCommentModel } from "./blog-post-comment.model";

export const BlogPostCommentLang = {
  NotFound: {
    [Language.En]: 'blog-post-comment not found',
    [Language.Ger]: '__TODO__',
  },
  CannotAccess: {
    [Language.En]: `you cannot access blog-post-comments`,
    [Language.Ger]: '__TODO__',
  },
  CannotFindMany: {
    [Language.En]: `you cannot view blog-post-comments`,
    [Language.Ger]: '__TODO__',
  },
  CannotCreate: {
    [Language.En]: `you cannot create blog-post-comments`,
    [Language.Ger]: '__TODO__',
  },
  CannotCreateForBlogPost: {
    [Language.En]: `you cannot create blog-post-comments for this blog-post`,
    [Language.Ger]: '__TODO__',
  },
  CannotUpdate: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot update this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
  CannotSoftDelete: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
  CannotHardDelete: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
  CannotRestore: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot restore this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
  CannotHide: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot hide/unhide this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
  CannotVanish: (arg: { model: BlogPostCommentModel }): LangSwitch => ({
    [Language.En]: `you cannot vanish/unvanish this blog-post-comment`,
    [Language.Ger]: '__TODO__',
  }),
};