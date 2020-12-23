import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Icons } from '../icons/icons.const';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpOutlined';
import SaveIcon from '@material-ui/icons/SaveOutlined';
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Markdown } from "../markdown/markdown";
import { OrNullable } from "../../types/or-nullable.type";
import { ist } from "../../helpers/ist.helper";
import { Debounce } from "../../helpers/debounce.helper";
import { _ls } from "../../helpers/_ls.helper";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { ExceptionButton } from "../exception-button/exception-button.helper";
import {
  AllBlogPostActionsFragment,
  AllBlogPostDataFragment,
  BlogPostCreateMutation,
  BlogPostCreateMutationVariables,
  BlogPostUpdateMutation,
  BlogPostUpdateMutationVariables,
  BlogPostSubmitMutation,
  BlogPostSubmitMutationVariables,
  BlogPostRejectMutation,
  BlogPostRejectMutationVariables,
  BlogPostApproveMutation,
  BlogPostApproveMutationVariables,
  BlogPostPublishMutation,
  BlogPostPublishMutationVariables,
  BlogPostUnpublishMutation,
  BlogPostUnpublishMutationVariables,
  BlogPostSoftDeleteMutation,
  BlogPostSoftDeleteMutationVariables,
  BlogPostHardDeleteMutation,
  BlogPostHardDeleteMutationVariables,
  BlogPostRestoreMutation,
  BlogPostRestoreMutationVariables,
  AllBlogPostStatusDataFragment,
} from "../../generated/graphql";
import { useMutation } from "react-query";
import { gql } from "graphql-request";
import { allUserDataFragment } from "../users/user.data.fragment";
import { allBlogPostActionsFragment } from "./blog-post.actions.fragment";
import { allBlogPostDataFragment } from "./blog-post.data.fragment";
import { OrNull } from "../../types/or-null.type";
import { ApiException } from "../../backend-api/api.exception";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { useDialog } from "../../hooks/use-dialog.hook";
import { useSnackbar } from "notistack";
import { LoadingDialog } from "../loading-dialog/loading-dialog";
import { useThemeColours } from "../../hooks/use-theme-colours.hook";
import { MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import { allBlogPostStatusDataFragment } from "../blog-post-statuses/blog-post-status.data.fragment";
import { allBlogPostStatusActionsFragment } from "../blog-post-statuses/blog-post-status.actions.fragment";
import { hidex } from "../../helpers/hidden.helper";


// query can be used elsewhere in parents...
export const blogPostMutateFormQueryName = 'BlogPostMutateFormQuery';
export const blogPostMutateFormQuery = gql`
query BlogPostMutateForm(
  $blog_post_id:Float!
){
  blogPosts(
    query:{
      offset:0
      limit:1
      filter:{
        attr:{
          id:{
            eq:$blog_post_id
          }
        }
      }
    }
  ){
    nodes{
      cursor
      data{ ...AllBlogPostData }
      can{ ...AllBlogPostActions }
      relations{
        author{
          data{ ...AllUserData }
        }
        status{
          data{ ...AllBlogPostStatusData }
          can{ ...AllBlogPostStatusActions }
        }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allUserDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostUpdateMutation = gql`
mutation BlogPostUpdate(
  $id:Int!
  $title:String
  $teaser:String
  $body:String
){
  updateBlogPost(
    dto:{
      id:$id
      title:$title
      teaser:$teaser
      body:$body
    }
  ){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`

const blogPostCreateMutation = gql`
mutation BlogPostCreate(
  $title:String!
  $teaser:String!
  $body:String!
){
  createBlogPost(
    dto:{
      title:$title
      teaser:$teaser
      body:$body
    }
  ){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`

const blogPostSoftDeleteMutation = gql`
mutation BlogPostSoftDelete(
  $id:Int!
){
  softDeleteBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostHardDeleteMutation = gql`
mutation BlogPostHardDelete(
  $id:Int!
){
  hardDeleteBlogPost(dto:{id:$id})
}
`;

const blogPostRestoreMutation = gql`
mutation BlogPostRestore(
  $id:Int!
){
  restoreBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostSubmitMutation = gql`
mutation BlogPostSubmit(
  $id:Int!
){
  submitBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostRejectMutation = gql`
mutation BlogPostReject(
  $id:Int!
){
  rejectBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostApproveMutation = gql`
mutation BlogPostApprove(
  $id:Int!
){
  approveBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostPublishMutation = gql`
mutation BlogPostPublish(
  $id:Int!
){
  publishBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;

const blogPostUnpublishMutation = gql`
mutation BlogPostUnpublish(
  $id:Int!
){
  unpublishBlogPost(dto:{id:$id}){
    data{ ...AllBlogPostData }
    can{ ...AllBlogPostActions }
    relations{
      status{
        data{ ...AllBlogPostStatusData }
        can{ ...AllBlogPostStatusActions }
      }
    }
  }
}
${allBlogPostActionsFragment}
${allBlogPostDataFragment}
${allBlogPostStatusDataFragment}
${allBlogPostStatusActionsFragment}
`;


const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
  paper: {
    padding: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
  teaserInput: {
    minHeight: '5em',
  },
  bodyInput: {
    minHeight: '10em',
  },
  markdownContainer: {
    paddingTop: '1em',
  },
}));

export interface IBlogPostMutateFormData {
  data: AllBlogPostDataFragment;
  can: AllBlogPostActionsFragment;
  statusData: OrNullable<AllBlogPostStatusDataFragment>;
}

export interface IBlogPostMutateFormProps {
  initial: OrNullable<IBlogPostMutateFormData>;
}

const _ls_blog_post_draft = {
  title: '_lsbp_title',
  teaser: '_lsbp_teaser',
  body: '_lsbp_body',
} as const;


export const BlogPostMutateForm = WithApi<IBlogPostMutateFormProps>((props) => {
  const {
    initial,
    api,
    me,
  } = props;

  const { enqueueSnackbar, } = useSnackbar();
  const classes = useStyles();
  const loadingDialog = useDialog();
  const router = useRouter();
  const [lsDebounce] = useState(() => ({
    title: new Debounce(750),
    teaser: new Debounce(750),
    body: new Debounce(750),
  }));
  const [autoSave, setAutoSave] = useState(true);
  const [current, setCurrent] = useState<OrNull<IBlogPostMutateFormData>>(initial ?? null);
  interface IFormState { title: string; teaser: string; body: string; }
  const [formState, setFormState] = useState<IFormState>(() => ({
    title: initial?.data.title ?? '',
    teaser: initial?.data.teaser ?? '',
    body: initial?.data.body ?? '',
  }));
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let isDisabled: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let isLoading: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let hasExtraActions: boolean = false;
  let error: OrNull<ApiException> = null;
  const setTitle = useCallback((title: string) => setFormState(prev => ({ ...prev, title, })), [setFormState]);
  const setTeaser = useCallback((teaser: string) => setFormState(prev => ({ ...prev, teaser, })), [setFormState]);
  const setBody = useCallback((body: string) => setFormState(prev => ({ ...prev, body, })), [setFormState]);
  // initialise from localstorage...
  useEffect(() => {
    if (ist.nullable(current?.data.id)) {
      if (!formState.title) { setTitle(_ls?.getItem(_ls_blog_post_draft.title) ?? formState.title); }
      if (!formState.teaser) { setTeaser(_ls?.getItem(_ls_blog_post_draft.teaser) ?? formState.teaser); }
      if (!formState.body) { setBody(_ls?.getItem(_ls_blog_post_draft.body) ?? formState.body); }
    }
  }, [process.browser]);

  const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _title = evt.target.value;
    if (ist.nullable(current?.data.id)) {
      lsDebounce.title.set(() => _ls?.setItem(_ls_blog_post_draft.title, _title,));
    }
    setTitle(_title);
  }

  const handleTeaserChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _teaser = evt.target.value;
    if (ist.nullable(current?.data.id)) {
      lsDebounce.teaser.set(() => _ls?.setItem(_ls_blog_post_draft.teaser, _teaser));
    }
    setTeaser(_teaser);
  }

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _body = evt.target.value;
    if (ist.nullable(current?.data.id)) {
      lsDebounce.body.set(() => _ls?.setItem(_ls_blog_post_draft.body, _body));
    }
    setBody(_body);
  }

  // ------------
  // mutate
  // ------------

  const [doMutate, mutateState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (current?.data.id) {
        // update
        const vars: BlogPostUpdateMutationVariables = {
          id: current.data.id,
          title: formState.title,
          teaser: formState.teaser,
          body: formState.body,
        };
        const result = await api.gql<BlogPostUpdateMutation, BlogPostUpdateMutationVariables>(
          blogPostUpdateMutation,
          vars
        );
        return {
          can: result.updateBlogPost.can,
          data: result.updateBlogPost.data,
          statusData: result.updateBlogPost.relations.status?.data,
        };
      }

      // create
      const vars: BlogPostCreateMutationVariables = {
        title: formState.title,
        teaser: formState.teaser,
        body: formState.body,
      };
      const result = await api.gql<BlogPostCreateMutation, BlogPostCreateMutationVariables>(
        blogPostCreateMutation,
        vars
      );
      return {
        can: result.createBlogPost.can,
        data: result.createBlogPost.data,
        statusData: result.createBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => {
        enqueueSnackbar(`Failed to Save Blog Post: ${fail.message}`, { variant: 'error', });
      },
      onSuccess: (success) => {
        lsDebounce.title.abort();
        lsDebounce.teaser.abort();
        lsDebounce.body.abort();
        _ls?.removeItem(_ls_blog_post_draft.title);
        _ls?.removeItem(_ls_blog_post_draft.teaser);
        _ls?.removeItem(_ls_blog_post_draft.body);
        enqueueSnackbar(`Saved Blog Post "${success.data.title}"`, { variant: 'success', });
        if (ist.nullable(current?.data.id)) {
          // on create
          const editRoute = `/posts/edit/${success.data.id}`;
          router.push(editRoute);
        } else {
          // on update
          setCurrent(success);
        }
      },
    },
  );
  isLoading = mutateState.isLoading || isLoading ;
  isDisabled = mutateState.isLoading || isDisabled ;
  error = mutateState.error || error ;

  // ------------
  // submit
  // ------------

  const [doSubmit, submitState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostSubmitMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostSubmitMutation, BlogPostSubmitMutationVariables>(
        blogPostSubmitMutation,
        vars,
      );
      return {
        can: result.submitBlogPost.can,
        data: result.submitBlogPost.data,
        statusData: result.submitBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Submit Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Submitted Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = submitState.isLoading || isLoading ;
  isDisabled = submitState.isLoading || isDisabled ;
  error = submitState.error || error ;
  hasExtraActions = current?.can.submit || hasExtraActions;
  const handleSubmitClicked = useCallback(() => doSubmit(), [doSubmit]);

  // ------------
  // reject
  // ------------
  const [doReject, rejectState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostRejectMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostRejectMutation, BlogPostRejectMutationVariables>(
        blogPostRejectMutation,
        vars,
      );
      return {
        can: result.rejectBlogPost.can,
        data: result.rejectBlogPost.data,
        statusData: result.rejectBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Reject Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Rejected Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = rejectState.isLoading || isLoading;
  isDisabled = rejectState.isLoading || isDisabled;
  error = rejectState.error || error;
  hasExtraActions = current?.can.reject || hasExtraActions;
  const handleRejectClicked = useCallback(() => doReject(), [doReject]);

  // ------------
  // approve
  // ------------
  const [doApprove, approveState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostApproveMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostApproveMutation, BlogPostApproveMutationVariables>(
        blogPostApproveMutation,
        vars,
      );
      return {
        can: result.approveBlogPost.can,
        data: result.approveBlogPost.data,
        statusData: result.approveBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Approve Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Approved Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = approveState.isLoading || isLoading;
  isDisabled = approveState.isLoading || isDisabled;
  error = approveState.error || error;
  hasExtraActions = current?.can.approve || hasExtraActions;
  const handleApproveClicked = useCallback(() => doApprove(), [doApprove]);

  // ------------
  // publish
  // ------------
  const [doPublish, publishState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostPublishMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostPublishMutation, BlogPostPublishMutationVariables>(
        blogPostPublishMutation,
        vars,
      );
      return {
        can: result.publishBlogPost.can,
        data: result.publishBlogPost.data,
        statusData: result.publishBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Publish Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Publishd Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = publishState.isLoading || isLoading;
  isDisabled = publishState.isLoading || isDisabled;
  error = publishState.error || error;
  hasExtraActions = current?.can.publish || hasExtraActions;
  const handlePublishClicked = useCallback(() => doPublish(), [doPublish]);

  // ------------
  // unpublish
  // ------------

  const [doUnpublish, unpublishState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostUnpublishMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostUnpublishMutation, BlogPostUnpublishMutationVariables>(
        blogPostUnpublishMutation,
        vars,
      );
      return {
        can: result.unpublishBlogPost.can,
        data: result.unpublishBlogPost.data,
        statusData: result.unpublishBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Unpublish Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Unpublishd Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = unpublishState.isLoading || isLoading;
  isDisabled = unpublishState.isLoading || isDisabled;
  error = unpublishState.error || error;
  hasExtraActions = current?.can.unpublish || hasExtraActions;
  const handleUnpublishClicked = useCallback(() => doUnpublish(), [doUnpublish]);

  // ------------
  // soft-delete
  // ------------

  const [doSoftDelete, softDeleteState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostSoftDeleteMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostSoftDeleteMutation, BlogPostSoftDeleteMutationVariables>(
        blogPostSoftDeleteMutation,
        vars,
      );
      return {
        can: result.softDeleteBlogPost.can,
        data: result.softDeleteBlogPost.data,
        statusData: result.softDeleteBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to SoftDelete Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`SoftDeleted Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = softDeleteState.isLoading || isLoading;
  isDisabled = softDeleteState.isLoading || isDisabled;
  error = softDeleteState.error || error;
  hasExtraActions = current?.can.softDelete || hasExtraActions;
  const handleSoftDeleteClicked = useCallback(() => doSoftDelete(), [doSoftDelete]);

  // ------------
  // hard-delete
  // ------------

  const [doHardDelete, hardDeleteState] = useMutation<boolean, ApiException>(
    async (): Promise<boolean> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostHardDeleteMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostHardDeleteMutation, BlogPostHardDeleteMutationVariables>(
        blogPostHardDeleteMutation,
        vars,
      );
      return result.hardDeleteBlogPost;
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to HardDelete Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: () => {
        enqueueSnackbar(`HardDeleted Blog Post`, { variant: 'success', });
        router.push('/posts');
      },
    },
  );
  isLoading = hardDeleteState.isLoading || isLoading;
  isDisabled = hardDeleteState.isLoading || isDisabled;
  error = hardDeleteState.error || error;
  hasExtraActions = current?.can.hardDelete || hasExtraActions;
  const handleHardDeleteClicked = useCallback(() => doHardDelete(), [doHardDelete]);

  // ------------
  // restore
  // ------------

  const [doRestore, restoreState] = useMutation<IBlogPostMutateFormData, ApiException>(
    async (): Promise<IBlogPostMutateFormData> => {
      if (!current?.data.id) throw ApiException({ code: -1, message: 'No id', });
      const vars: BlogPostRestoreMutationVariables = { id: current.data.id, };
      const result = await api.gql<BlogPostRestoreMutation, BlogPostRestoreMutationVariables>(
        blogPostRestoreMutation,
        vars,
      );
      return {
        can: result.restoreBlogPost.can,
        data: result.restoreBlogPost.data,
        statusData: result.restoreBlogPost.relations.status?.data,
      };
    },
    {
      onMutate: loadingDialog.doOpen,
      onSettled: loadingDialog.doClose,
      onError: (fail) => void enqueueSnackbar(`Failed to Restore Blog Post: ${fail.message}`, { variant: 'error', }),
      onSuccess: (success) => {
        enqueueSnackbar(`Restored Blog Post "${success.data.title}"`, { variant: 'success', });
        setCurrent(success);
      },
    },
  );
  isLoading = restoreState.isLoading || isLoading;
  isDisabled = restoreState.isLoading || isDisabled;
  error = restoreState.error || error;
  hasExtraActions = current?.can.restore || hasExtraActions;
  const handleRestoreClicked = useCallback(() => doRestore(), [doRestore]);


  // -----------------

  const handleFormSubmitted = useSubmitForm(doMutate, [doMutate]);

  // -----------------

  /**
   * Menu
   */
  const themeColours = useThemeColours();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleMenuClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => { setMenuAnchor(evt.currentTarget); }, []);
  const handleMenuClose = useCallback(() => { setMenuAnchor(null); }, []);

  const saveIsDisabled = isDisabled || !(initial?.can.update || me.can?.blogPosts.create);

  return (
    <>
      <LoadingDialog title="Loading..." dialog={loadingDialog} />
      <Grid className={classes.root} container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <form onSubmit={handleFormSubmitted}>
              <Grid container spacing={2}>
                {/* settings & actions */}
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Box mr="1" display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                      <Typography className="centered" component="span" variant="body2">
                        autosave
                      </Typography>
                      <Switch
                        color="primary"
                        checked={autoSave}
                        onChange={() => setAutoSave(!autoSave)}
                        name="Auto save"
                        inputProps={{ 'aria-label': 'auto save' }}
                      />
                    </Box>
                    <Box mr={1}>
                      <IconButton
                        disabled={saveIsDisabled}
                        type="submit"
                        color="primary"
                      >
                        <SaveIcon />
                      </IconButton>
                    </Box>
                    <Box mr={1}>
                      <Button
                        startIcon={menuAnchor ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        variant="outlined"
                        color="primary"
                        onClick={handleMenuClick}
                        disabled={!hasExtraActions}
                      >
                        More Actions
                      </Button>
                    </Box>
                    <Menu
                      anchorEl={menuAnchor}
                      onClose={handleMenuClose}
                      open={!!menuAnchor}
                      keepMounted
                    >
                      <>
                        <MenuItem disabled={isDisabled || !current?.can.show}>
                          <NextLink href={`/blog/view/${current?.data.id}`} passHref>
                            <MUILink className="btn-link centered row" color="inherit">
                              <ListItemIcon className={themeColours.primary}><Icons.View /></ListItemIcon>
                              <ListItemText className={themeColours.primary}>View</ListItemText>
                            </MUILink>
                          </NextLink>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.submit} onClick={handleSubmitClicked}>
                          <ListItemIcon className={themeColours.primary}><Icons.Submit /></ListItemIcon>
                          <ListItemText className={themeColours.primary}>Submit</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.reject} onClick={handleRejectClicked}>
                          <ListItemIcon className={themeColours.warning}><Icons.Reject /></ListItemIcon>
                          <ListItemText className={themeColours.warning}>Reject</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.approve} onClick={handleApproveClicked}>
                          <ListItemIcon className={themeColours.success}><Icons.Approve /></ListItemIcon>
                          <ListItemText className={themeColours.success}>Approve</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.publish} onClick={handlePublishClicked}>
                          <ListItemIcon className={themeColours.success}><Icons.Publish /></ListItemIcon>
                          <ListItemText className={themeColours.success}>Publish</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.unpublish} onClick={handleUnpublishClicked}>
                          <ListItemIcon className={themeColours.error}><Icons.Unpublish /></ListItemIcon>
                          <ListItemText className={themeColours.error}>Unpublish</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.softDelete} onClick={handleSoftDeleteClicked}>
                          <ListItemIcon className={themeColours.error}><Icons.SoftDelete /></ListItemIcon>
                          <ListItemText className={themeColours.error}>Delete</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.restore} onClick={handleRestoreClicked}>
                          <ListItemIcon className={themeColours.info}><Icons.Restore /></ListItemIcon>
                          <ListItemText className={themeColours.info}>Restore</ListItemText>
                        </MenuItem>
                        <MenuItem disabled={isDisabled || !current?.can.hardDelete} onClick={handleHardDeleteClicked}>
                          <ListItemIcon className={themeColours.error}><Icons.HardDelete /></ListItemIcon>
                          <ListItemText className={themeColours.error}>Delete Forever</ListItemText>
                        </MenuItem>
                      </>
                    </Menu>
                    <Box mx={1}>
                      <ExceptionButton exception={error} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography className="capitalise" component="h4" variant="h4">
                    {current?.statusData?.colour && (
                      <span style={{ color: current.statusData.colour }}>
                        {current.statusData.name}
                      </span>
                    )}
                    {!current?.statusData?.colour && '?'}
                  </Typography>
                </Grid>
                {/* <Grid className={hidex(!isLoading)} item xs={12} sm={12}>
                  <LinearProgress />
                </Grid> */}

                {/* title */}
                <Grid item xs={12} sm={6}>
                    <TextField
                      label="title"
                      margin="dense"
                      fullWidth
                      variant="standard"
                      error={!!error?.data?.title}
                      helperText={error?.data?.title?.join('\n')}
                      disabled={saveIsDisabled}
                      className={classes.fullWidth}
                      onChange={handleTitleChange}
                      value={formState.title}
                    />
                </Grid>

                {/* title */}
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom={true} variant="h1" component="h1">
                    {formState.title}
                  </Typography>
                </Grid>


                {/* teaser */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="teaser"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    error={!!error?.data?.teaser}
                    helperText={error?.data?.teaser?.join('\n')}
                    disabled={saveIsDisabled}
                    className={classes.fullWidth}
                    inputProps={{ className: classes.bodyInput }}
                    multiline
                    onChange={handleTeaserChange}
                    value={formState.teaser}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.markdownContainer}>
                    <Markdown>
                      {formState.teaser}
                    </Markdown>
                  </Box>
                </Grid>
              </Grid>

              {/* body */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="body"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    error={!!error?.data?.body}
                    helperText={error?.data?.body?.join('\n')}
                    disabled={saveIsDisabled}
                    className={classes.fullWidth}
                    inputProps={{ className: classes.bodyInput }}
                    multiline
                    onChange={handleBodyChange}
                    value={formState.body}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.markdownContainer}>
                    <Markdown>
                      {formState.body}
                    </Markdown>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
});
