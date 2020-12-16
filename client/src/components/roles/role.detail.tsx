import {
  Grid,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/EditOutlined';
import { gql } from "graphql-request";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { RoleDetailDataQuery, RoleDetailDataQueryVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { IRoleMutateFormRole, RoleMutateFormDialog } from "./role-mutate.form.dialog";
import { IIdentityFn } from "../../types/identity-fn.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { flsx } from "../../helpers/flsx.helper";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";

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

export const RoleDetail = WithApi<IRoleDetailProps>((props) => {
  const { role_id, onUpdated, me, api } = props;

  const [vars, setVars] = useState<RoleDetailDataQueryVariables>({ id: Number(role_id), });
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<RoleDetailDataQuery, ApiException>(
    [RoleDetailDataQueryName(role_id), vars, me.hash],
    async (): Promise<RoleDetailDataQuery> => {
      const result = await api.gql<RoleDetailDataQuery, RoleDetailDataQueryVariables>(
        roleDetailDataQuery,
        vars,
      );
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
});


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