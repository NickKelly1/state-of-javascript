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
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { gql } from "graphql-request";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { ApiContext } from "../../components-contexts/api.context";
import { UserDetailDataQuery, UserDetailDataQueryVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { DebugException } from "../debug-exception/debug-exception";
import { NotFound } from "../not-found/not-found";
import { IUserMutateFormRole, UserMutateFormDialog } from "./user-mutate.form.dialog";
import { IIdentityFn } from "../../types/identity-fn.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { flsx } from "../../helpers/flsx.helper";

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
    <Grid container spacing={2}>
      {isLoading && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {error && (
        <Grid item xs={12}>
          <DebugException centered always exception={error} />
        </Grid>
      )}
      {users?.length === 0 && (
        <Grid item xs={12}>
          <NotFound message={`Role "${user_id}" not found`} />
        </Grid>
      )}
      {users?.length === 1 && (
        <Grid item xs={12}>
          <UserDetailContent
            user={users[0]}
            onSuccess={handleSuccess}
          />
        </Grid>
      )}
    </Grid>
  );
}

interface IRoleDetailContentProps {
  user: NonNullable<UserDetailDataQuery['users']['nodes'][0]>
  onSuccess: IIdentityFn;
}

function UserDetailContent(props: IRoleDetailContentProps) {
  const { user, onSuccess, } = props;
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

  return (
    <>
      <UserMutateFormDialog dialog={editDialog} user={userFormData} onSuccess={handleRoleUpdated} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={2}>
              <Typography component="h2" variant="h2">
                {`${user.data.id} - ${user.data.name}`}
              </Typography>
            </Box>
            {user.can.update && (
              <Box pr={2}>
                <IconButton color="primary" onClick={editDialog.doOpen}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
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