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
import { RoleDetailDataQuery, RoleDetailDataQueryVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { DebugException } from "../debug-exception/debug-exception";
import { NotFound } from "../not-found/not-found";
import { IRoleMutateFormRole, RoleMutateFormDialog } from "./role-mutate.form.dialog";
import { IIdentityFn } from "../../types/identity-fn.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { flsx } from "../../helpers/flsx.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";

const RoleDetailDataQueryName = (id: Id) => `RoleDetailDataQuery_${id}`;
const roleDetailDataQuery = gql`
query RoleDetailData(
  $id:Float!
){
  roles(
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
    nodes{
      can{
        show
        update
        softDelete
        hardDelete
        createRolePermissions
      }
      data{
        id
        name
			}
    }
  }
}
`;

interface IRoleDetailProps {
  role_id: Id;
  onUpdated?: IIdentityFn;
}

export function RoleDetail(props: IRoleDetailProps) {
  const { role_id, onUpdated } = props;
  const { me, api } = useContext(ApiContext);

  const [vars, setVars] = useState<RoleDetailDataQueryVariables>({ id: Number(role_id), });
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<RoleDetailDataQuery, ApiException>(
    [RoleDetailDataQueryName(role_id), vars, me?.hash],
    async (): Promise<RoleDetailDataQuery> => {
        const result = await api
          .connector
          .graphql<RoleDetailDataQuery, RoleDetailDataQueryVariables>(
            roleDetailDataQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        return result;
      },
  );

  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);
  const handleSuccess: IIdentityFn = useCallback(() => {
    refetch();
    onUpdated?.();
  }, [onUpdated, refetch])

  return (
    <WithLoadable data={roles?.[0]} error={error} isLoading={isLoading}>
      {dat => <RoleDetailContent role={dat} onSuccess={handleSuccess} />}
    </WithLoadable>
  );
}


interface IRoleDetailContentProps {
  role: NonNullable<RoleDetailDataQuery['roles']['nodes'][0]>
  onSuccess: IIdentityFn;
}

function RoleDetailContent(props: IRoleDetailContentProps) {
  const { role, onSuccess, } = props;
  const editRoleDialog = useDialog();
  const handleRoleUpdated = useCallback(
    () => flsx(onSuccess, editRoleDialog.doClose)(),
    [onSuccess, editRoleDialog.doClose],
  );
  const roleFormData: IRoleMutateFormRole = useMemo(
    () => ({ id: role.data.id, name: role.data.name }),
    [role],
  );

  return (
    <>
      <RoleMutateFormDialog dialog={editRoleDialog} role={roleFormData} onSuccess={handleRoleUpdated} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={2}>
              <Typography component="h2" variant="h2">
                {`${role.data.name}`}
              </Typography>
            </Box>
            {role.can.update && (
              <Box pr={2}>
                <IconButton color="primary" onClick={editRoleDialog.doOpen}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}