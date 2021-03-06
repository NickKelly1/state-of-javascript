import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import React, {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { Markdown } from "../markdown/markdown";
import { OrNullable } from "../../types/or-nullable.type";
import { ist } from "../../helpers/ist.helper";
import { OrPromise } from "../../types/or-promise.type";
import { Debounce } from "../../helpers/debounce.helper";
import { _ls } from "../../helpers/_ls.helper";
import { useSnackbar } from "notistack";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";


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
  label: {
    paddingBottom: theme.spacing(1),
  },
  markdownContainer: {
    paddingTop: '1em',
  },
}));

export interface INewsArticleMutateFormData {
  title: string;
  teaser: string;
  body: string;
}

export interface INewsArticleMutateFormProps {
  id: OrNullable<number>;
  onSave: OrNullable<((data: INewsArticleMutateFormData) => OrPromise<boolean>)>;
  onAutoSave: OrNullable<((data: INewsArticleMutateFormData) => unknown)>;
  lastSavedAt: OrNullable<number>;
  initial: OrNullable<INewsArticleMutateFormData>;
  isDisabled: boolean;
  error: OrNullable<IApiException>;
  canShow: boolean;
  canSave: boolean;
  canSoftDelete: boolean;
}

const _ls_news_draft = {
  title: '_lsnd_title',
  teaser: '_lsnd_teaser',
  body: '_lsnd_body',
} as const;


export const NewsArticleMutateForm = WithApi<INewsArticleMutateFormProps>((props) => {
  const {
    id,
    onSave,
    initial,
    isDisabled,
    error,
    canShow,
    canSave,
    canSoftDelete,
    api,
    me,
  } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [lsDebounce] = useState(() => ({
    title: new Debounce(750),
    teaser: new Debounce(750),
    body: new Debounce(750),
  }));

  const [title, setTitle] = useState(initial?.title ?? '');
  const [teaser, setTeaser] = useState(initial?.teaser ?? '');
  const [body, setBody] = useState(initial?.body ?? '');


  // initialise from localstorage...
  useEffect(() => {
    if (ist.nullable(id)) {
      if (!title) { setTitle(_ls?.getItem(_ls_news_draft.title) ?? title); }
      if (!teaser) { setTeaser(_ls?.getItem(_ls_news_draft.teaser) ?? teaser); }
      if (!body) { setBody(_ls?.getItem(_ls_news_draft.body) ?? body); }
    }
  }, [process.browser]);


  const [autoSave, setAutoSave] = useState(true);

  const handleSave: FormEventHandler<HTMLFormElement> = async(evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // _ls?.sa
    const success = await onSave?.({ title, teaser, body });
    if (success) {
      lsDebounce.title.abort();
      lsDebounce.teaser.abort();
      lsDebounce.body.abort();
      _ls?.removeItem(_ls_news_draft.title);
      _ls?.removeItem(_ls_news_draft.teaser);
      _ls?.removeItem(_ls_news_draft.body);
    }
  };

  const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _title = evt.target.value;
    if (ist.nullable(id)) {
      lsDebounce.title.set(() => _ls?.setItem(_ls_news_draft.title, _title));
    }
    setTitle(_title);
  }

  const handleTeaserChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _teaser = evt.target.value;
    if (ist.nullable(id)) {
      lsDebounce.teaser.set(() => _ls?.setItem(_ls_news_draft.teaser, _teaser));
    }
    setTeaser(_teaser);
  }

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    const _body = evt.target.value;
    if (ist.nullable(id)) {
      lsDebounce.body.set(() => _ls?.setItem(_ls_news_draft.body, _body));
    }
    setBody(_body);
  }

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <form
            onSubmit={handleSave}>
            <Grid container spacing={2}>
              {/* settings & actions */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="space-around" alignItems="center">
                  <Box>
                    <Box display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                      <Typography className="centered" component="span" variant="body2">
                        autosave
                      </Typography>
                      <Switch
                        color="primary"
                        checked={autoSave}
                        onChange={() => setAutoSave(!autoSave)}
                        name="auto save"
                        inputProps={{ 'aria-label': 'auto save' }}
                      />
                    </Box>
                    <Typography className="centered" component="div" variant="body2" color="textSecondary">
                      not saved
                    </Typography>
                  </Box>
                  <Box className="centered">
                    {(id && canShow) && (
                      <Box m={1}>
                        <NextLink href={`/news/view/${id}`} passHref>
                          <MUILink className="btn-link" color="inherit">
                            <Button disabled={isDisabled} color="primary" variant="outlined">
                              {'View'}
                            </Button>
                          </MUILink>
                        </NextLink>
                      </Box>
                    )}
                    {canSave && (
                      <Box m={1}>
                        <Button disabled={isDisabled} type="submit" color="primary" variant="outlined">
                          {'Save'}
                        </Button>
                      </Box>
                    )}
                    {canSoftDelete && (
                      <Box m={1}>
                        <Button disabled={isDisabled} color="secondary" variant="outlined">
                          {'Delete'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} />


              {/* progress */}
              {isDisabled && (
                <>
                  <Grid item xs={12} sm={6}><LinearProgress /></Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              {error && (
                <>
                  <Grid className="centered" item xs={12} sm={6}>
                    <FormHelperText error>
                      {error.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              {/* title */}
              <Grid item xs={12} sm={6}>
                  <InputLabel
                    className={classes.label}
                    htmlFor="news_article_title">title</InputLabel>
                  <TextField
                    id="news_article_title"
                    variant="standard"
                    error={!!error?.data?.title}
                    helperText={error?.data?.title?.join('\n')}
                    disabled={isDisabled}
                    className={classes.fullWidth}
                    onChange={handleTitleChange}
                    value={title}
                  />
              </Grid>
              <Grid item xs={12} sm={6} />


              {/* teaser */}
              <Grid item xs={12} sm={6}>
                <InputLabel
                  className={classes.label}
                  htmlFor="news_article_teaser">teaser</InputLabel>
                <TextField
                  id="news_article_teaser"
                  variant="outlined"
                  helperText={error?.data?.teaser?.join('\n')}
                  disabled={isDisabled}
                  className={classes.fullWidth}
                  inputProps={{ className: classes.bodyInput }}
                  multiline
                  onChange={handleTeaserChange}
                  value={teaser}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.markdownContainer}>
                  <Markdown>
                    {teaser}
                  </Markdown>
                </Box>
              </Grid>
            </Grid>

            {/* body */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel
                  className={classes.label}
                  htmlFor="news_article_body">body</InputLabel>
                <TextField
                  id="news_article_body"
                  variant="outlined"
                  helperText={error?.data?.body?.join('\n')}
                  disabled={isDisabled}
                  className={classes.fullWidth}
                  inputProps={{ className: classes.bodyInput }}
                  multiline
                  onChange={handleBodyChange}
                  value={body}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.markdownContainer}>
                  <Markdown>
                    {body}
                  </Markdown>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
});
