import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Icons } from '../icons/icons.const';
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OrNullable } from "../../types/or-nullable.type";
import { ist } from "../../helpers/ist.helper";
import { Debounce } from "../../helpers/debounce.helper";
import { _ls } from "../../helpers/_ls.helper";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import {
  BlogPostCreateMutation,
  BlogPostCreateMutationVariables,
  BlogPostUpdateMutation,
  BlogPostUpdateMutationVariables,
  BlogPostActionsFragment,
  BlogPostDataFragment,
  BlogPostStatusDataFragment,
  UserDataFragment,
  ImageDataFragment,
  FileDataFragment,
} from "../../generated/graphql";
import { useMutation, useQuery } from "react-query";
import { OrNull } from "../../types/or-null.type";
import { ApiException } from "../../backend-api/api.exception";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { useDialog } from "../../hooks/use-dialog.hook";
import { useSnackbar } from "notistack";
import { LoadingDialog } from "../loading-dialog/loading-dialog";
import { useThemeColours } from "../../hooks/use-theme-colours.hook";
import { useRouter } from "next/router";
import { hidex } from "../../helpers/hidden.helper";
import { JsonDialog } from "../debug-json-dialog/json-dialog";
import { OrUndefined } from "../../types/or-undefined.type";
import { IImagePickerFallback, ImagePicker } from "../image-picker/image-picker";
import { blogPostMutateToFormData, createBlogPostMutateDropdownList } from "./blog-post-mutate.dropdown";
import { ActionDropdown } from "../../action-dropdown/action.dropdown";
import { BLOG_POST_CREATE_MUTATION, BLOG_POST_UPDATE_MUTATION } from "./blog-post-mutate.queries";
import { useDebugMode } from "../../components-contexts/debug-mode.context";
import { useUpdate } from "../../hooks/use-update.hook";
import { useAsyncify } from "../../hooks/use-asyncify.hook";


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
  fab: {
    margin: theme.spacing(2),
  },
}));

export interface IBlogPostMutateFormData {
  data: BlogPostDataFragment;
  can: BlogPostActionsFragment;
  statusData: OrNullable<BlogPostStatusDataFragment>;
  author: OrNullable<UserDataFragment>;
  image: OrNullable<ImageDataFragment>;
  thumbnail: OrNullable<FileDataFragment>;
  original: OrNullable<FileDataFragment>;
  display: OrNullable<FileDataFragment>;
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
  const handlePartialUpdate = useCallback((next: IBlogPostMutateFormData) => {
    setCurrent((prev) => prev ? ({ ...prev, can: next.can, statusData: next.statusData, }) : next);
  }, [setCurrent]);
  useUpdate(() => { initial && handlePartialUpdate(initial); }, [initial]);

  interface IFormState {
    title: string;
    teaser: string;
    body: string;
    // todo... image
    image: OrUndefined<File>;
  }
  const [formState, setFormState] = useState<IFormState>(() => ({
    title: initial?.data.title ?? '',
    teaser: initial?.data.teaser ?? '',
    body: initial?.data.body ?? '',
    // todo... image
    image: undefined,
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
    if (ist.nullable(current?.data.id)) { lsDebounce.title.set(() => _ls?.setItem(_ls_blog_post_draft.title, _title,)); }
    setTitle(_title);
  }

  const handleTeaserChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _teaser = evt.target.value;
    if (ist.nullable(current?.data.id)) { lsDebounce.teaser.set(() => _ls?.setItem(_ls_blog_post_draft.teaser, _teaser)); }
    setTeaser(_teaser);
  }

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _body = evt.target.value;
    if (ist.nullable(current?.data.id)) { lsDebounce.body.set(() => _ls?.setItem(_ls_blog_post_draft.body, _body)); }
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
          // image: formState.image,
        };
        const result = await api.gql<BlogPostUpdateMutation, BlogPostUpdateMutationVariables>(
          BLOG_POST_UPDATE_MUTATION,
          vars
        );
        return blogPostMutateToFormData(result.updateBlogPost);
      }

      // create
      const image = formState.image;
      if (!image) throw ApiException({ code: -1, message: 'No image' });

      const vars: BlogPostCreateMutationVariables = {
        title: formState.title,
        teaser: formState.teaser,
        body: formState.body,
        image,
      };
      const result = await api.gql<BlogPostCreateMutation, BlogPostCreateMutationVariables>(
        BLOG_POST_CREATE_MUTATION,
        vars
      );
      return blogPostMutateToFormData(result.createBlogPost);
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
          const editRoute = `/admin/posts/edit/${success.data.id}`;
          router.push(editRoute);
        } else {
          // on update
          setCurrent(success);
        }
      },
    },
  );
  isLoading = mutateState.isLoading || isLoading;
  isDisabled = mutateState.isLoading || isDisabled;
  error = mutateState.error || error ;

  const dropdownList = useMemo(() =>
    current?.data.id
      ? createBlogPostMutateDropdownList({
        can: current.can,
        globalCan: me.can,
        api,
        id: current.data.id,
        enqueueSnackbar,
        onUpdated: handlePartialUpdate,
        router,
      })
      : null
    , [current, me, handlePartialUpdate, enqueueSnackbar,]);

  // -----------------

  const handleFormSubmitted = useSubmitForm(doMutate, [doMutate]);

  // -----------------

  const saveIsDisabled = isDisabled || !(initial?.can.update || me.can?.blogPosts.create);

  const debugDialog = useDialog();
  const debugMode = useDebugMode();
  const debugData = useMemo(
    () => ({ current, formState, }),
    [current, formState],
  );

  const theme = useTheme();
  const is_xs = useMediaQuery(theme.breakpoints.down('xs'));

  const formerImage = useQuery<undefined | IImagePickerFallback, ApiException>(
    [me.hash, current?.display],
    async () => {
      if (!current?.display) return undefined;
      const blob = await api
        .http(`/blog-posts/${current.data.id}/display`, { method: 'GET' })
        .then(result => result.blob());
      // remember the blob so it doesn't get GC'd
      // TODO: don't think __remember is actually required...
      return { __remember: blob, src: URL.createObjectURL(blob) };
    },
    { refetchOnWindowFocus: false, },
  )

  return (
    <>
      <LoadingDialog title="Loading..." dialog={loadingDialog} />
      <JsonDialog title={"Form"} dialog={debugDialog} data={debugData} />
      <Grid className={classes.root} container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <form onSubmit={handleFormSubmitted}>
              <Grid container spacing={2}>

                {/* title */}
                <Grid item xs={12}>
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

                {/* status */}
                <Grid item xs={12} className="centered">
                  <Typography style={{ display: 'inline' }} className="capitalise" component="h4" variant="h4">
                    {'Status: '}
                    {current?.statusData?.colour && (
                      <span style={{ color: current.statusData.colour }}>
                        {current.statusData.name}
                      </span>
                    )}
                    {!current?.statusData?.colour && '?'}
                  </Typography>
                </Grid>

                {/* author */}
                <Grid item xs={12} className="centered">
                  <Typography style={{ display: 'inline' }} className="capitalise" component="h4" variant="h4">
                    {'Author: '}
                    {current?.author?.name && current?.author?.name}
                    {!current?.author?.name && '?'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} className="centered">
                  <ImagePicker
                    onChange={(image) => {
                      if (!image) setFormState((prev) => ({ ...prev, image: undefined }));
                      else setFormState((prev) => ({ ...prev, image, }))
                    }}
                    image={formState.image}
                    fallback={formerImage.data}
                    isLoading={formerImage.isLoading}
                  />
                </Grid>

                {/* teaser */}
                <Grid item xs={12}>
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

                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={is_xs ? 'center' : 'space-between'}
                    flexDirection={is_xs ? 'column' : 'row'}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={is_xs ? 'center' : 'space-between'}
                      flexDirection={is_xs ? 'column' : 'row'}>
                      <Box px={1} className="centered">
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
                      {(!is_xs || debugMode.isOn) && (
                        <Box
                          px={1}
                          className={hidex(!debugMode.isOn)}>
                          <IconButton onClick={debugDialog.doToggle} color="primary">
                            <Icons.Debug />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={is_xs ? 'space-between' : 'center'}
                      flexDirection={is_xs ? 'column' : 'row'}>
                      {dropdownList && (
                        <Box px={1}>
                          <ActionDropdown actions={dropdownList} />
                        </Box>
                      )}
                      <Box px={1}>
                        <Button disabled={saveIsDisabled} type="submit" color="primary" endIcon={<Icons.Save />}>
                          Save
                        </Button>
                      </Box>
                    </Box>
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
