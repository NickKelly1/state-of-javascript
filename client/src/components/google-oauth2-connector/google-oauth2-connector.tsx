import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Code } from "@material-ui/icons";
import { gql } from "graphql-request";
import { useSnackbar } from "notistack";
import React, { MouseEventHandler, useCallback, useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { ApiConnector } from "../../backend-api/api.connector";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../components-contexts/api.context";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";
import { WithoutSsr } from "../../components-hoc/without-first-load/without-ssr";
import {
  GoogleOAuth2ConnectorDataQueryVariables,
  GoogleOAuth2ConnectorDataQuery,
  InitialiseIntegrationFormMutation,
  InitialiseIntegrationFormMutationVariables,
  GoogleOAuth2ConnectorCodeFormMutation,
  GoogleOAuth2ConnectorCodeFormMutationVariables,
  GoogleOAuth2ConnectorUrlDataQuery,
  GoogleOAuth2ConnectorUrlDataQueryVariables,
} from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { flsx } from "../../helpers/flsx.helper";
import { useDialog } from "../../hooks/use-dialog.hook";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { Id } from "../../types/id.type";
import { IIdentityFn } from "../../types/identity-fn.type";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";

const GoogleOAuth2ConnectorDataQueryName = 'GoogleOAuth2ConnectorData';
const googleOAuth2ConnectorDataQuery = gql`
query  GoogleOAuth2ConnectorData{
  google{
    can{
      oauth2
      sendGmail
    }
    integration{
      can{
        show
        initialise
      }
      data{
        id
        name
        error
        public
        is_connected
        created_at
        updated_at
      }
    }
  }
}
`;

const googleOAuth2ConnectorUrlDataQueryName = 'GoogleOAuth2ConnectorUrlDataQuery';
const googleOAuth2ConnectorUrlDataQuery = gql`
query GoogleOAuth2ConnectorUrlData{
  googleOAuth2GetUrl
}
`;

const googleOAuth2ConnectorCodeFormMutation = gql`
mutation GoogleOAuth2ConnectorCodeForm(
  $code:String!
){
  googleOAuth2HandleCode(code:$code){
    can{
      oauth2
      sendGmail
    }
    integration{
      can{
        show
        initialise
      }
      data{
        id
        name
        error
        public
        is_connected
        created_at
        updated_at
      }
    }
  }
}
`;

const initialiseIntegrationFormMutation = gql`
mutation InitialiseIntegrationForm(
  $id:Int!
  $init:JsonObject!
){
  initialiseIntegration(
    dto:{
      id:$id
      init:$init
    }
  ){
    data{
      id
      name
      error
      public
      is_connected
      created_at
      updated_at
    }
  }
}
`;


interface IGoogleOAuth2ConnectorProps {
  //
}

const useGoogleOAuth2ConnectorStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

export const GoogleOAuth2Connector = WithoutSsr<IGoogleOAuth2ConnectorProps>(WithApi((props) => {
  const { api, me, } = props;
  const classes = useGoogleOAuth2ConnectorStyles();
  const { data, error, isLoading, refetch } = useQuery<GoogleOAuth2ConnectorDataQuery, IApiException>(
    [GoogleOAuth2ConnectorDataQueryName, me.hash],
    async (): Promise<GoogleOAuth2ConnectorDataQuery> => {
      const vars: GoogleOAuth2ConnectorDataQueryVariables = {};
      const result = await api.gql<GoogleOAuth2ConnectorDataQuery, GoogleOAuth2ConnectorDataQueryVariables>(
        googleOAuth2ConnectorDataQuery,
        vars,
      );
      return result;
    },
  );

  return (
    <Paper className={classes.paper}>
      <WithLoadable data={data} isLoading={isLoading} error={error}>
        {(data) => <GoogleOAuth2ConnectorContents onStale={refetch} data={data} />}
      </WithLoadable>
    </Paper>
  )
}))

interface IGoogleOAuth2ConnectorContentsProps {
  data: GoogleOAuth2ConnectorDataQuery;
  onStale: IIdentityFn;
}

export function GoogleOAuth2ConnectorContents(props: IGoogleOAuth2ConnectorContentsProps) {
  const { data, onStale } = props;

  const initialiseDialog = useDialog();
  const oauth2Dialog = useDialog();

  const handleResetSuccess = useCallback(
    () => flsx(initialiseDialog.doClose, onStale)(),
    [initialiseDialog.doClose, onStale, ],
  );
  const handleOAuth2Success: IGoogleOAuth2OnSuccessFn = useCallback(
    () => flsx(oauth2Dialog.doClose, onStale)(),
    [oauth2Dialog.doClose, onStale, ],
  );

  const statusColor = data.google.integration.data.is_connected ? 'primary' : 'secondary';

  return (
    <>
      <InitialiseIntegrationFormDialog name="Google" dialog={initialiseDialog} integration_id={data.google.integration.data.id} onSuccess={handleResetSuccess} />
      <GoogleOAuth2FormDialog name="Google" dialog={oauth2Dialog} onSuccess={handleOAuth2Success} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="h2">
              {data.google.integration.data.name}
            </Typography>
            {data.google.integration.can.initialise && (
              <Box ml={2}>
                <Button variant="outlined" onClick={initialiseDialog.doOpen} color="primary">
                  Initialise
                </Button>
              </Box>
            )}
            {data.google.can.oauth2 && (
              <Box ml={2}>
                <Button variant="outlined" onClick={oauth2Dialog.doOpen} color="primary">
                  Authorise
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Typography>
              Status:
            </Typography>
            <Box ml={2}>
              <Typography color={statusColor}>
                {data.google.integration.data.is_connected ? 'connected' : 'disconnected'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {data.google.integration.data.public && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Typography>
                Public:
              </Typography>
              <Box ml={2}>
                <Typography>
                  {data.google.integration.data.public}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        {data.google.integration.data.error && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Typography>
                Error:
              </Typography>
              <Box ml={2}>
                <Typography color="secondary">
                  {data.google.integration.data.error}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}


interface IIntegrationInitialisedOnSuccessFn { (arg: InitialiseIntegrationFormMutation): any }
interface IInitialiseIntegrationFormDialogProps extends IWithDialogueProps {
  name: string;
  integration_id: Id;
  onSuccess: IIntegrationInitialisedOnSuccessFn;
}

const InitialiseIntegrationFormDialog = WithDialogue<IInitialiseIntegrationFormDialogProps>({ fullWidth: true })(WithApi((props) => {
  const { name, dialog, onSuccess, integration_id, api, me, } = props;
  const { enqueueSnackbar } = useSnackbar();
  interface IFormState { init: string; }
  const [ formState, setFormState ] = useState<IFormState>({ init: '{}' });

  const handleSuccess: IIntegrationInitialisedOnSuccessFn = useCallback((arg) => {
    enqueueSnackbar(`Updated integration "${arg.initialiseIntegration.data.name}"`, { variant: 'success', });
    onSuccess(arg);
  }, [onSuccess]);

  const [doSubmit, submitState] = useMutation<InitialiseIntegrationFormMutation, IApiException>(
    async () => {
      let parsedInit: any;
      try { parsedInit = JSON.parse(formState.init.trim()); }
      catch (error) {
        throw ApiException({
          code: -1,
          name: 'bad request',
          error: 'bad request',
          message: 'bad request',
          data: { init: ['init must be valid json'],},
        });
      }
      const vars: InitialiseIntegrationFormMutationVariables = {
        id: Number(integration_id),
        init: parsedInit,
      };
      const result = await api.gql<InitialiseIntegrationFormMutation, InitialiseIntegrationFormMutationVariables>(
        initialiseIntegrationFormMutation,
        vars,
      )
      return result;
    },
    { onSuccess: handleSuccess, }
  );

  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleInitChange = useCallback(change(setFormState, 'init'), []);

  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <>
      <DialogTitle>
        {`Initialise ${name}`}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="init (json)"
                fullWidth
                margin="dense"
                multiline
                value={formState.init}
                error={!!error?.data?.init}
                helperText={error?.data?.init?.join('\n')}
                onChange={handleInitChange}
              />
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            {isDisabled && (
              <Grid className="centered col" item xs={12}>
                <FilledCircularProgress active={isDisabled} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button disabled={isDisabled} color="primary" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}));


interface IGoogleOAuth2OnSuccessFn { (arg: GoogleOAuth2ConnectorCodeFormMutation): any }
interface IGoogleOAuth2FormDialogProps extends IWithDialogueProps {
  name: string;
  onSuccess: IGoogleOAuth2OnSuccessFn;
}


const GoogleOAuth2FormDialog = WithDialogue<IGoogleOAuth2FormDialogProps>({ fullWidth: true })(WithApi((props) => {
  const { name, dialog, onSuccess, api, me, } = props;
  const { enqueueSnackbar } = useSnackbar();

  interface IFormState { url: string; code: string }
  const [formState, setFormState] = useState<IFormState>({ url: '', code: '' });

  // OAuth2 step 1. url - google url given by server to visit & retrieve a code to provide the server
  interface IHandleGetUrlSuccess { (arg: GoogleOAuth2ConnectorUrlDataQuery): any }
  const handleGetUrlSuccess: IHandleGetUrlSuccess = useCallback(
    (arg) => {
      enqueueSnackbar(`Google OAuth2 url created`, { variant: 'success' });
      setFormState((prev) => ({ ...prev, url: arg.googleOAuth2GetUrl }));
    },
    [onSuccess],
  );
  const [doSubmitGetUrl, submitGetUrlState] = useMutation<GoogleOAuth2ConnectorUrlDataQuery, IApiException>(
    async () => {
      const vars: GoogleOAuth2ConnectorUrlDataQueryVariables = {};
      const result = await api.gql<GoogleOAuth2ConnectorUrlDataQuery, GoogleOAuth2ConnectorUrlDataQueryVariables>(
        googleOAuth2ConnectorUrlDataQuery,
        vars
      );
      return result;
    },
    { onSuccess: handleGetUrlSuccess },
  );

  // OAuth2 Step 2. code - given by Google by visiting the url. Give to the server for it to receive access token
  const handleSubmitCodeSuccess: IGoogleOAuth2OnSuccessFn = useCallback((arg) => {
    const success = !!arg.googleOAuth2HandleCode.integration.data.is_connected;
    if (success) {
      // code accepted
      enqueueSnackbar(`Google OAuth2 code accepted`, { variant: 'success' });
      onSuccess(arg);
    }
    else {
      // code (probably?) rejected
      enqueueSnackbar(`Google OAuth2 code rejected`, { variant: 'warning' });
    }
  }, [onSuccess]);
  const [doSubmitCode, submitCodeState] = useMutation<GoogleOAuth2ConnectorCodeFormMutation, IApiException>(
    async () => {
      const vars: GoogleOAuth2ConnectorCodeFormMutationVariables = {
        code: formState.code,
      };
      const result = await api.gql<GoogleOAuth2ConnectorCodeFormMutation, GoogleOAuth2ConnectorCodeFormMutationVariables>(
        googleOAuth2ConnectorCodeFormMutation,
        vars
      )
      return result;
    },
    { onSuccess: handleSubmitCodeSuccess },
  );

  const urlRef = useRef<undefined | HTMLInputElement>();
  const handleGetUrlClicked = useCallback(() => doSubmitGetUrl(), [doSubmitGetUrl]);
  const handleSubmitCode =  useCallback(() => doSubmitCode(), [doSubmitCode]);
  const handleCodeChange = useCallback(change(setFormState, 'code'), [setFormState]);
  const handleCopyUrlClicked: MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    urlRef.current?.select();
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }, []);

  const isDisabled = submitGetUrlState.isLoading || submitCodeState.isLoading;
  const error = submitGetUrlState.error || submitCodeState.error;

  // not inside a form... form was causing some issues submitting at unexpected times
  return (
    <>
      <DialogTitle>
        {`Authorise with ${name}`}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormHelperText>1. Generate a url</FormHelperText>
            <FormHelperText>2. Navigate to that url and authorise</FormHelperText>
            <FormHelperText>3. Copy the code given and paste below</FormHelperText>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Button onClick={handleGetUrlClicked} color="primary" variant="outlined">
                Generate url
              </Button>
              {formState.url && (
                <Box ml={2}>
                  <IconButton onClick={handleCopyUrlClicked} color="primary"><FileCopyIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box maxWidth="100%">
              <TextField
                multiline
                // variant="outlined"
                disabled={!formState.url}
                label={!formState.url ? "Click above to generate a Google OAuth2 url" : undefined}
                margin="dense"
                fullWidth
                inputRef={urlRef}
                value={formState.url}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="code"
              margin="dense"
              variant="outlined"
              multiline
              value={formState.code}
              onChange={handleCodeChange}
              error={!!error?.data?.code}
              helperText={error?.data?.code?.join('\n')}
            />
          </Grid>
          {error && (
            <Grid className="centered col" item xs={12}>
              <FormHelperText error>
                {error.message}
              </FormHelperText>
            </Grid>
          )}
          {isDisabled && (
            <Grid className="centered col" item xs={12}>
              <FilledCircularProgress active={isDisabled} />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled} color="primary" onClick={handleSubmitCode}>
          Submit Code
        </Button>
      </DialogActions>
    </>
  );
}));
