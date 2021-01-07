import { Icons } from '../icons/icons.const';
import React from "react";
import {
  BlogPostSubmitMutation,
  BlogPostSubmitMutationVariables,
  BlogPostSoftDeleteMutation,
  BlogPostSoftDeleteMutationVariables,
  BlogPostHardDeleteMutation,
  BlogPostHardDeleteMutationVariables,
  AuthorisedActionsFieldsFragment,
  BlogPostApproveMutation,
  BlogPostApproveMutationVariables,
  BlogPostPublishMutation,
  BlogPostPublishMutationVariables,
  BlogPostUnpublishMutation,
  BlogPostUnpublishMutationVariables,
  BlogPostRestoreMutation,
  BlogPostRestoreMutationVariables,
  BlogPostMutateDataFragment,
  BlogPostActionsFragment,
  BlogPostRejectMutation,
} from "../../generated/graphql";
import { ApiException } from "../../backend-api/api.exception";
import { IActionItem } from "../../action-dropdown/action.dropdown";
import { ident } from "../../helpers/ident.helper";
import { Api } from "../../backend-api/api";
import {
  BLOG_POST_APPROVE_MUTATION,
  BLOG_POST_HARD_DELETE_MUTATION,
  BLOG_POST_PUBLISH_MUTATION,
  BLOG_POST_REJECT_MUTATION,
  BLOG_POST_RESTORE_MUTATION,
  BLOG_POST_SOFT_DELETE_MUTATION,
  BLOG_POST_SUBMIT_MUTATION,
  BLOG_POST_UNPUBLISH_MUTATION,
} from "./blog-post-mutate.queries";
import { OrNull } from '../../types/or-null.type';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { NextRouter, } from 'next/router';
import { IBlogPostMutateFormData } from './blog-post-mutate.form';
import { OrPromise } from '../../types/or-promise.type';

interface BlogPostMutateDropdownArg {
  id: number;
  globalCan: OrNull<AuthorisedActionsFieldsFragment>;
  can: OrNull<BlogPostActionsFragment>;
  api: Api;
  enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
  router: NextRouter;
  onUpdated: (next: IBlogPostMutateFormData) => OrPromise<void>;
}

export function blogPostMutateToFormData(arg: BlogPostMutateDataFragment): IBlogPostMutateFormData {
  return {
    can: arg.can,
    data: arg.data,
    statusData: arg.relations.status?.data,
    author: arg.relations.author?.data,
    image: arg.relations.image?.data,
    display: arg.relations.image?.relations.display?.data,
    original: arg.relations.image?.relations.original?.data,
    thumbnail: arg.relations.image?.relations.thumbnail?.data,
  };
}

export const createBlogPostMutateDropdownList = (arg: BlogPostMutateDropdownArg): IActionItem[]  => {
  const {
    can,
    globalCan,
    id,
    api,
    enqueueSnackbar,
    router,
    onUpdated,
  } = arg;

  return [
    /**
     * Submit
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'submit',
      color: 'primary',
      disabled: !can?.submit,
      text: 'Submit',
      icon: <Icons.Submit />,
      onClick: async () => {
        const vars: BlogPostSubmitMutationVariables = { id, }
        const result = await api.gql<BlogPostSubmitMutation, BlogPostSubmitMutationVariables>(
          BLOG_POST_SUBMIT_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.submitBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Submit Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Submitted Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Approve
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'approve',
      color: 'primary',
      disabled: !can?.approve,
      text: 'Approve',
      icon: <Icons.Approve />,
      onClick: async () => {
        const vars: BlogPostApproveMutationVariables = { id, }
        const result = await api.gql<BlogPostApproveMutation, BlogPostApproveMutationVariables>(
          BLOG_POST_APPROVE_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.approveBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Approve Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Approved Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Publish
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'publish',
      color: 'success',
      disabled: !can?.publish,
      text: 'Publish',
      icon: <Icons.Publish />,
      onClick: async () => {
        const vars: BlogPostPublishMutationVariables = { id, }
        const result = await api.gql<BlogPostPublishMutation, BlogPostPublishMutationVariables>(
          BLOG_POST_PUBLISH_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.publishBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Publish Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Published Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Restore
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'restore',
      color: 'primary',
      disabled: !can?.restore,
      text: 'Restore',
      icon: <Icons.Restore />,
      onClick: async () => {
        const vars: BlogPostRestoreMutationVariables = { id, }
        const result = await api.gql<BlogPostRestoreMutation, BlogPostRestoreMutationVariables>(
          BLOG_POST_RESTORE_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.restoreBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Restore Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Restored Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Reject
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'reject',
      color: 'warning',
      disabled: !can?.reject,
      text: 'Reject',
      icon: <Icons.Reject />,
      onClick: async () => {
        const vars: BlogPostSoftDeleteMutationVariables = { id, }
        const result = await api.gql<BlogPostRejectMutation, BlogPostSoftDeleteMutationVariables>(
          BLOG_POST_REJECT_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.rejectBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Reject Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Rejected Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Unpublish
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'unpublish',
      color: 'warning',
      disabled: !can?.unpublish,
      text: 'Unpublish',
      icon: <Icons.Unpublish />,
      onClick: async () => {
        const vars: BlogPostUnpublishMutationVariables = { id, }
        const result = await api.gql<BlogPostUnpublishMutation, BlogPostUnpublishMutationVariables>(
          BLOG_POST_UNPUBLISH_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.unpublishBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to Unpublish Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Unpublishd Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Soft Delete
     */
    ident<IActionItem<IBlogPostMutateFormData, ApiException>>({
      key: 'soft-delete',
      color: 'error',
      disabled: !can?.softDelete,
      text: 'Delete',
      icon: <Icons.SoftDelete />,
      onClick: async () => {
        const vars: BlogPostSoftDeleteMutationVariables = { id, }
        const result = await api.gql<BlogPostSoftDeleteMutation, BlogPostSoftDeleteMutationVariables>(
          BLOG_POST_SOFT_DELETE_MUTATION,
          vars,
        );
        return blogPostMutateToFormData(result.softDeleteBlogPost);
      },
      onError: (fail) => void enqueueSnackbar(`Failed to SoftDelete Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`SoftDeleted Blog Post "${success.data.title}"`, { variant: 'success', });
        onUpdated(success);
      },
    }),

    /**
     * Hard Delete
     */
    ident<IActionItem<boolean, ApiException>>({
      key: 'hard-delete',
      text: 'Delete Forever',
      color: 'error',
      icon: <Icons.HardDelete />,
      disabled: !can?.hardDelete,
      onClick: async () => {
        const vars: BlogPostHardDeleteMutationVariables = { id, }
        const result = await api.gql<BlogPostHardDeleteMutation, BlogPostHardDeleteMutationVariables>(
          BLOG_POST_HARD_DELETE_MUTATION,
          vars,
        );
        return result.hardDeleteBlogPost;
      },
      onError: (fail) => void enqueueSnackbar(`Failed to HardDelete Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: () => {
        enqueueSnackbar(`HardDeleted Blog Post`, { variant: 'success', });
        router.push('/posts');
      },
    }),
  ];
}
