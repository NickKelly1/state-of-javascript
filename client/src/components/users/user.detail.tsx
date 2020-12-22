import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import { gql } from "graphql-request";
import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import {
  RequestPasswordResetEmailMutation,
  RequestVerificationEmailMutation,
  RequestVerificationEmailMutationVariables,
  UserDetailDataQuery,
  UserDetailDataQueryVariables,
} from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { IUserMutateFormRole, UserMutateFormDialog } from "./user-mutate.form.dialog";
import { IIdentityFn } from "../../types/identity-fn.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { flsx } from "../../helpers/flsx.helper";
import { JsonDialog } from "../debug-json-dialog/json-dialog";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { useSnackbar } from "notistack";
import { LoadingDialog } from "../loading-dialog/loading-dialog";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";
import { RequestUserEmailChangeFormDialog } from "./request-email-change.form.dialog";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { useThemeColours } from "../../hooks/use-theme-colours.hook";
import { OrNull } from "../../types/or-null.type";
import { ExceptionButton } from "../exception-button/exception-button.helper";

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
        restore
        deactivate
        forceVerify
        forceUpdateEmail
        updatePassword
        requestWelcomeEmail
        consumeWelcomeToken
        requestVerificationEmail
        requestEmailChangeEmail
        requestPasswordResetEmail
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

interface IUserDetailProps {
  user_id: Id;
  onUpdated?: IIdentityFn;
}

export const UserDetail = WithApi<IUserDetailProps>((props) => {
  const { user_id, onUpdated, api, me, } = props;

  const [vars, setVars] = useState<UserDetailDataQueryVariables>({ id: Number(user_id), });
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<UserDetailDataQuery, ApiException>(
    [UserDetailDataQueryName(user_id), vars, me?.hash],
    async (): Promise<UserDetailDataQuery> => {
        const result = await api.gql<UserDetailDataQuery, UserDetailDataQueryVariables>(
          userDetailDataQuery,
          vars,
        );
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
});

interface IRoleDetailContentProps {
  user: NonNullable<UserDetailDataQuery['users']['nodes'][0]>
  onSuccess: IIdentityFn;
}

const UserDetailContent = WithApi<IRoleDetailContentProps>((props) => {
  const { user, onSuccess, api, me, } = props;
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
      canUpdate: user.can.update,
      canDeactivate: user.can.deactivate,
      canUpdatePassword: user.can.updatePassword,
      canForceVerify: user.can.forceVerify,
      canForceUpdateEmail: user.can.forceUpdateEmail,
    }),
    [user],
  );

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let isLoading: boolean = false;
  let error: OrNull<ApiException> = null;
  const loadingDialog = useDialog();

  const [doRequestPasswordResetEmail, requestPasswordResetEmailState] = useMutation<RequestPasswordResetEmailMutation, ApiException>(
    async (): Promise<RequestPasswordResetEmailMutation> => {
      if (!user.data.email) {
        throw ApiException({
          code: -1,
          message: 'No email - cannot request password reset',
          name: 'Client Error',
        });
      }
      const result = await api.requestPasswordResetEmail({ email: user.data.email });
      return result;
    },
    {
      onMutate: loadingDialog.doOpen,
      onError: (reason) => {
        loadingDialog.doClose();
        enqueueSnackbar(`Failed to Reset Password: ${reason.message}`, { variant: 'error' });
      },
      onSuccess: () => {
        loadingDialog.doClose();
        enqueueSnackbar(`Password Reset email sent to "${user.data.email}"`, { variant: 'success' });
      },
    },
  );
  isLoading = isLoading || requestPasswordResetEmailState.isLoading;
  error = error || requestPasswordResetEmailState.error;
  const handleRequestPasswordResetClicked = useCallback(() => doRequestPasswordResetEmail(), [doRequestPasswordResetEmail]);

  // ------------
  // request welcome email
  // ------------

  const [doRequestWelcomeEmail, requestWelcomeEmailState] = useMutation<RequestVerificationEmailMutation, IApiException>(
    async (): Promise<RequestVerificationEmailMutation> => {
      const vars: RequestVerificationEmailMutationVariables = {
        id: Number(user.data.id),
      };
      const result = await api.requestVerificationEmail(vars);
      return result;
    },
    {
      onMutate: loadingDialog.doOpen,
      onError: (reason) => {
        loadingDialog.doClose();
        enqueueSnackbar(`Failed to Send Welcome Email: ${reason.message}`, { variant: 'error' });
      },
      onSuccess: (success: RequestVerificationEmailMutation) => {
        loadingDialog.doClose();
        if (success.requestVerificationEmail) {
          enqueueSnackbar(`Welcome email sent to "${user.data.email}"`, { variant: 'success' });
        }
        else {
          enqueueSnackbar('Failed to send welcome email. Something went wrong', { variant: 'warning' });
        }
      },
    },
  );
  isLoading = isLoading || requestWelcomeEmailState.isLoading;
  error = error || requestWelcomeEmailState.error;
  const handleRequestWelcomeEmailClicked = useCallback(() => doRequestWelcomeEmail(), [doRequestWelcomeEmail]);

  // ------------
  // email change
  // ------------

  const requestEmailChangeEmailDialog = useDialog();
  const debugDialog = useDialog();

  /**
   * Menu
   */
  const themeColours = useThemeColours();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleMenuClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => { setMenuAnchor(evt.currentTarget); }, []);
  const handleMenuClose = useCallback(() => { setMenuAnchor(null); }, []);

  const isDisabled = isLoading;

  return (
    <>
      <RequestUserEmailChangeFormDialog
        dialog={requestEmailChangeEmailDialog}
        initialEmail={user.data.email ?? ''}
        onSuccess={requestEmailChangeEmailDialog.doClose}
        user_id={user.data.id}
      />
      <UserMutateFormDialog dialog={editDialog} user={userFormData} onSuccess={handleRoleUpdated} />
      <JsonDialog title={userFormData.name} data={user} dialog={debugDialog} />
      <LoadingDialog title="Loading..." dialog={loadingDialog} />
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
            {error && (
              <Box ml={2}>
                <ExceptionButton exception={error}/>
              </Box>
            )}
            {/* TODO: clean up user updating... */}
            {(user.can.update || user.can.deactivate || user.can.forceUpdateEmail || user.can.forceVerify) && (
              <Box ml={1}>
                <IconButton color="primary" onClick={editDialog.doOpen}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
            <Box ml={1}>
              <Button
                startIcon={menuAnchor ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                variant="outlined"
                color="primary"
                onClick={handleMenuClick}
                disabled={!(
                  user.can.requestWelcomeEmail
                  || user.can.requestPasswordResetEmail
                  || user.can.requestVerificationEmail
                  || user.can.requestEmailChangeEmail
                )}
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
                {user.can.requestWelcomeEmail && (
                  <MenuItem disabled={isDisabled} onClick={handleRequestWelcomeEmailClicked}>
                    <ListItemIcon className={themeColours.primary}><MailOutlineIcon /></ListItemIcon>
                    {/* also verifies account... */}
                    <ListItemText className={themeColours.primary}>Send Welcome Email</ListItemText>
                  </MenuItem>
                )}
                {user.can.requestPasswordResetEmail && ist.defined(user.data.email) && (
                  <MenuItem disabled={isDisabled} onClick={handleRequestPasswordResetClicked}>
                    <ListItemIcon className={themeColours.warning}><LockOpenIcon /></ListItemIcon>
                    <ListItemText className={themeColours.warning}>Send Reset Password Email</ListItemText>
                  </MenuItem>
                )}
                {user.can.requestVerificationEmail && (
                  <MenuItem disabled={isDisabled} onClick={undefined}>
                    <ListItemIcon className={themeColours.success}><MailOutlineIcon /></ListItemIcon>
                    <ListItemText className={themeColours.success}>Send Verification Email</ListItemText>
                  </MenuItem>
                )}
                {user.can.requestEmailChangeEmail && (
                  <MenuItem disabled={isDisabled} onClick={requestEmailChangeEmailDialog.doToggle}>
                    <ListItemIcon className={themeColours.error}><MailOutlineIcon /></ListItemIcon>
                    <ListItemText className={themeColours.error}>Request Email Change Email</ListItemText>
                  </MenuItem>
                )}
              </>
            </Menu>
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
});