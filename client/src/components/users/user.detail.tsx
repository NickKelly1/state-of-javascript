import {
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  IconButton,
} from "@material-ui/core";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { gql } from "graphql-request";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { ApiContext } from "../../components-contexts/api.context";
import {
  UserDetailDataQuery,
  UserDetailDataQueryVariables,
  UserDetailRequestForgottenUserPasswordResetMutation,
  UserDetailRequestForgottenUserPasswordResetMutationVariables,
  UserDetailRequestSendWelcomeEmailMutation,
  UserDetailRequestSendWelcomeEmailMutationVariables,
} from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { DebugException } from "../debug-exception/debug-exception";
import { NotFound } from "../not-found/not-found";
import { IUserMutateFormRole, UserMutateFormDialog } from "./user-mutate.form.dialog";
import { IIdentityFn } from "../../types/identity-fn.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { flsx } from "../../helpers/flsx.helper";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { useSnackbar } from "notistack";
import { LoadingDialog } from "../loading-dialog/loading-dialog";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";

const UserDetailDataQueryName = (id: Id) => `UserDetailDataQuery_${id}`;
const userDetailDataQuery = gql`
query UserDetailData(
  $id:Float!
){
  users(
    query:{
      filter:{
        attr:{
          id:{
            eq:$id
          }
        }
      }
    }
  ){
    can{
      show
      create
    }
    pagination{
      limit
      offset
      total
      page_number
      pages
      more
    }
    nodes{
      can{
        show
        update
        softDelete
        hardDelete
        deactivate
        updatePassword
        requestWelcome
        acceptWelcome
        requestVerificationEmail
        requestEmailChange
        requestForgottenPasswordReset
      }
      data{
        id
        name
        email
        verified
        deactivated
        created_at
        updated_at
        deleted_at
      }
    }
  }
}
`;

const userDetailRequestSendWelcomeEmailMutation = gql`
mutation UserDetailRequestSendWelcomeEmail(
  $id:Int!
){
  requestUserWelcome(
    dto:{
      user_id:$id
    }
  )
}
`;

const userDetailRequestForgottenUserPasswordResetMutation = gql`
mutation UserDetailRequestForgottenUserPasswordReset(
  $email:String!
){
  requestForgottenUserPasswordReset(
    dto:{
      email:$email
    }
  )
}
`;

interface IUserDetailProps {
  user_id: Id;
  onUpdated?: IIdentityFn;
}

export function UserDetail(props: IUserDetailProps) {
  const { user_id, onUpdated } = props;
  const { me, api } = useContext(ApiContext);

  const [vars, setVars] = useState<UserDetailDataQueryVariables>({ id: Number(user_id), });
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<UserDetailDataQuery, ApiException>(
    [UserDetailDataQueryName(user_id), vars, me?.hash],
    async (): Promise<UserDetailDataQuery> => {
        const result = await api
          .connector
          .graphql<UserDetailDataQuery, UserDetailDataQueryVariables>(
            userDetailDataQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        return result;
      },
  );

  const users = useMemo(() => data?.users.nodes.filter(ist.notNullable), [data?.users]);
  const handleSuccess: IIdentityFn = useCallback(() => flsx(refetch, onUpdated)(), [onUpdated, refetch])

  return (
    <WithLoadable isLoading={isLoading} error={error} data={users?.[0]}>
      {(data) => <UserDetailContent user={data} onSuccess={handleSuccess} />}
    </WithLoadable>
  );
}

interface IRoleDetailContentProps {
  user: NonNullable<UserDetailDataQuery['users']['nodes'][0]>
  onSuccess: IIdentityFn;
}

function UserDetailContent(props: IRoleDetailContentProps) {
  const { user, onSuccess, } = props;
  const { api, me } = useContext(ApiContext);
  const { enqueueSnackbar } = useSnackbar();
  const editDialog = useDialog();
  const handleRoleUpdated = useCallback(
    () => flsx(onSuccess, editDialog.doClose)(),
    [onSuccess, editDialog.doClose],
  );
  const userFormData: IUserMutateFormRole = useMemo<IUserMutateFormRole>(
    () => ({
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
      verified: user.data.verified,
      deactivated: user.data.deactivated,
      canDeactivate: user.can.deactivate,
      canUpdatePassword: user.can.updatePassword,
    }),
    [user],
  );

  // welcome email
  const resetPasswordDialog = useDialog();

  // Send PasswordReset Email: starting...
  const handleSendPasswordResetSending = useCallback(() => {
    resetPasswordDialog.doOpen();
  }, [resetPasswordDialog]);

  // Send PasswordReset Email: error
  const handleResetPasswordError = useCallback((exception: IApiException) => {
    resetPasswordDialog.doClose();
    enqueueSnackbar(`Failed to Reset Password: ${exception.error}`, { variant: 'error' });
  }, [resetPasswordDialog]);

  // Send PasswordReset Email: (maybe) success
  const handleResetPasswordSuccess = useCallback((arg: UserDetailRequestForgottenUserPasswordResetMutation) => {
    resetPasswordDialog.doClose();
    enqueueSnackbar(`Password Reset email sent to "${user.data.email}"`, { variant: 'success' });
  }, [resetPasswordDialog]);

  const [resetPassword, resetPasswordState] = useMutation<UserDetailRequestForgottenUserPasswordResetMutation, IApiException>(
    async (): Promise<UserDetailRequestForgottenUserPasswordResetMutation> => {
      if (!user.data.email) {
        throw ApiException({
          code: -1,
          error: 'Client Error',
          message: 'No email - cannot request password reset',
          name: 'Client Error',
        });
      }
      const vars: UserDetailRequestForgottenUserPasswordResetMutationVariables = {
        email: user.data.email,
      };
      const result = await api
        .connector
        .graphql<UserDetailRequestForgottenUserPasswordResetMutation, UserDetailRequestForgottenUserPasswordResetMutationVariables>(
          userDetailRequestForgottenUserPasswordResetMutation,
          vars,
        )
        .catch(rethrow(normaliseApiException));
      return result;
    },
    {
      onMutate: handleSendPasswordResetSending,
      onError: handleResetPasswordError,
      onSuccess: handleResetPasswordSuccess,
    },
  );
  const handleResetPasswordClicked = useCallback(() => resetPassword(), [resetPassword]);

  // ------------
  // welcome email
  // ------------

  const welcomeEmailSendingDialog = useDialog();

  // Send Welcome Email: starting...
  const handleSendWelcomeEmailSending = useCallback(() => {
    welcomeEmailSendingDialog.doOpen();
  }, [welcomeEmailSendingDialog]);

  // Send Welcome Email: error
  const handleSendWelcomeEmailError = useCallback((exception: IApiException) => {
    welcomeEmailSendingDialog.doClose();
    enqueueSnackbar(`Failed to Send Welcome Email: ${exception.message}`, { variant: 'error' });
  }, [welcomeEmailSendingDialog]);

  // Send Welcome Email: (maybe) success
  const handleSendWelcomeEmailSuccess = useCallback((arg: UserDetailRequestSendWelcomeEmailMutation) => {
    welcomeEmailSendingDialog.doClose();
    if (arg.requestUserWelcome) { enqueueSnackbar(`Welcome email sent to "${user.data.email}"`, { variant: 'success' }); }
    else { enqueueSnackbar('Failed to send welcome email. Something went wrong', { variant: 'warning' }); }
  }, [welcomeEmailSendingDialog]);

  const [sendWelcomeEmail, sendWelcomeEmailState] = useMutation<UserDetailRequestSendWelcomeEmailMutation, IApiException>(
    async (): Promise<UserDetailRequestSendWelcomeEmailMutation> => {
      const vars: UserDetailRequestSendWelcomeEmailMutationVariables = {
        id: Number(user.data.id),
      };
      const result = await api
        .connector
        .graphql<UserDetailRequestSendWelcomeEmailMutation, UserDetailRequestSendWelcomeEmailMutationVariables>(
          userDetailRequestSendWelcomeEmailMutation,
          vars,
        )
        .catch(rethrow(normaliseApiException));
      return result;
    },
    {
      onMutate: handleSendWelcomeEmailSending,
      onError: handleSendWelcomeEmailError,
      onSuccess: handleSendWelcomeEmailSuccess,
    },
  );
  const handleSendWelcomeEmailClicked = useCallback(() => sendWelcomeEmail(), [sendWelcomeEmail]);

  const debugDialog = useDialog();

  return (
    <>
      <UserMutateFormDialog dialog={editDialog} user={userFormData} onSuccess={handleRoleUpdated} />
      <DebugJsonDialog title={userFormData.name} data={user} dialog={debugDialog} />
      <LoadingDialog title="Sending Welcome Email..." dialog={welcomeEmailSendingDialog} />
      <LoadingDialog title="Sending Password Reset Email..." dialog={resetPasswordDialog} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box>
              <Typography component="h2" variant="h2">
                {user.data.name}
              </Typography>
            </Box>
            <WhenDebugMode>
              <Box ml={2}>
                <IconButton color="primary" onClick={debugDialog.doToggle}>
                  <BugReportIcon />
                </IconButton>
              </Box>
            </WhenDebugMode>
            {user.can.update && (
              <Box ml={1}>
                <IconButton color="primary" onClick={editDialog.doOpen}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
            {user.can.requestWelcome && (
              <Box ml={1}>
                <Button startIcon={<MailOutlineIcon />} color="primary" onClick={handleSendWelcomeEmailClicked}>
                  {/* also verifies account... */}
                  Send Welcome
                </Button>
              </Box>
            )}
            {user.can.requestForgottenPasswordReset && (
              <Box ml={1}>
                <Button startIcon={<LockOpenIcon />} color="primary" onClick={handleResetPasswordClicked}>
                  Reset Password
                </Button>
              </Box>
            )}
            {user.can.requestVerificationEmail && (
              <Box ml={1}>
                <Button color="primary">
                  Password verification email
                </Button>
              </Box>
            )}
            {/* // TODO: */}
            {/* {user.can.requestEmailChange && (
              <Box ml={1}>
                <Button color="primary">
                  Password verification email
                </Button>
              </Box>
            )} */}
          </Box>
        </Grid>
        <Grid item xs={12}>
          {/* can't see identifying information without permission */}
          {`email: ${user.data.email ?? '?'}`}
        </Grid>
        <Grid item xs={12}>
          {/* can't see identifying information without permission */}
          {`verified: ${(user.data.verified === true) ? 'yes' : (user.data.verified === false) ? 'no' : '?'}`}
        </Grid>
        <Grid item xs={12}>
          {`Deactivated: ${user.data.deactivated ? 'true' : 'false'}`}
        </Grid>
      </Grid>
    </>
  );
}