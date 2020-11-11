import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  Typography,
} from "@material-ui/core";
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  gql,
} from "graphql-request";
import React, { FormEventHandler, useCallback, useContext, useMemo, useState } from "react";
import {
  TypedQueryFunction,
  useMutation, useQuery,
} from "react-query";
import {
  ApiException,
} from "../../backend-api/api.exception";
import {
  normaliseApiException,
  rethrow,
} from "../../backend-api/normalise-api-exception.helper";
import {
  ApiContext,
} from "../../contexts/api.context";
import {
  RoleFormDataQuery,
  RoleFormDataQueryVariables,
  RoleFormUpdateMutation,
  RoleFormUpdateMutationVariables,
} from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import FourZeroFourPage from "../../pages/404";
import {
  Id,
} from "../../types/id.type";
import {
  JsonPretty,
} from "../json-pretty/json-pretty";
import {
  IListBuilderItem,
  IListBuilderLists,
  IListBuilderOnChangeFn,
  IListBuilderProps,
  IListBuilderConfig,
  ListBuilder,
  IListBuilderOnChangeFnArg,
} from "../list-builder/list-builder";
import { NotFound } from "../not-found/not-found";
import { WithMemo } from "../with-memo/with-memo";
import { useUpdate } from "../../hooks/use-update.hook";
import { DebugException } from "../debug-exception/debug-exception";
import { ring } from "../../helpers/ring.helper";
import { DashColours } from "../../dashboard-theme";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";


const roleFormDataQuery = gql`
query RoleFormData(
  $id:Float!
  $rolesPermissionsLimit:Int!
  $rolesPermissionsOffset:Int!
  $permissionsLimit:Int!
  $permissionsOffset:Int!
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
        delete
        createRolePermission
      }
      data{
        id
        name
			}
      relations{
        permissions(
          query:{
            limit:$rolesPermissionsLimit
            offset:$rolesPermissionsOffset
            sorts:[
              {field:"id", dir:Asc }
            ]
          }
        ){
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
              createRolePermission
            }
            data{
              id
              name
            }
          }
        }
      }
    }
  }
  permissions(
    query:{
      limit:$permissionsLimit
      offset:$permissionsOffset
      sorts:[
        {field:"id", dir:Asc}
      ]
    }
  ){
    nodes{
      can{
        show
        createRolePermission
      }
      data{
        id
        name
      }
    }
  }
}
`;


const roleFormCreateMutation = gql`
mutation RoleFormCreate(
  $name:String!
  $permission_ids:[Int!]
){
  createRole(
    dto:{
      name:$name
      permission_ids:$permission_ids
    }
  ){
    can{
      show
      update
      delete
      createRolePermission
    }
    data{
      id
      name
    }
    relations{
      permissions{
        nodes{
          can{
            show
            createRolePermission
          }
          data{
            id
            name
          }
        }
      }
    }
  }
}
`;


const roleFormUpdateMutation = gql`
mutation RoleFormUpdate(
  $id:Int!
  $name:String
  $permission_ids:[Int!]
){
  updateRole(
    dto:{
      id:$id
      name:$name
      permission_ids:$permission_ids
    }
  ){
    can{
      show
      update
      delete
      createRolePermission
    }
    data{
      id
      name
    }
    relations{
      permissions{
        nodes{
          can{
            show
            createRolePermission
          }
          data{
            id
            name
          }
        }
      }
    }
  }
}
`;


const roleFormDeleteMutation = gql`
mutation RoleFormDelete{
  deleteRole(
    dto:{
      id:12
		}
  )
}
`;


export interface IRoleFormOnSuccessFnArg { id: Id; name: string; }
export interface IRoleFormOnSuccessFn {
  (arg: IRoleFormOnSuccessFnArg): any;
}

export interface IRoleFormProps {
  role_id: Id;
  onSuccess?: IRoleFormOnSuccessFn;
}

export function RoleForm(props: IRoleFormProps) {
  const { role_id, onSuccess } = props;
  const { api, me, } = useContext(ApiContext);

  const queryFn: TypedQueryFunction<RoleFormDataQuery> = useCallback(async (): Promise<RoleFormDataQuery> => {
    const _vars: RoleFormDataQueryVariables = {
      id: Number(role_id),
      permissionsLimit: 10_000,
      permissionsOffset: 0,
      rolesPermissionsLimit: 10_000,
      rolesPermissionsOffset: 0,
    };
    const result = await api
      .connector
      .graphql<RoleFormDataQuery, RoleFormDataQueryVariables>(
        roleFormDataQuery,
        _vars,
      )
      .catch(rethrow(normaliseApiException))
    return result;
  }, [me, role_id]);

  const { data, refetch, isLoading, error, } = useQuery<RoleFormDataQuery, ApiException>(`role_form_${role_id}`, queryFn, {});
  // refetch on user update
  useUpdate(() => refetch(), [me]);

  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);
  const permissions = useMemo(() => data?.permissions.nodes.filter(ist.notNullable), [data?.permissions]);

  return (
    <Grid container spacing={2}>
      {error && (
        <Grid item xs={12}>
          <Typography color="error">
            <JsonPretty src={error} />
          </Typography>
        </Grid>
      )}
      {isLoading && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {roles?.length === 0 && (
        <Grid item xs={12}>
          <NotFound message={`Role "${role_id}" not found"`} />
        </Grid>
      )}
      {permissions && roles?.length === 1 && (
        <Grid item xs={12}>
          <RoleFormContent
            role={roles[0]}
            permissions={permissions}
            onSuccess={onSuccess}
          />
        </Grid>
      )}
    </Grid>
  );
}

interface IRoleFormContentProps {
  role: NonNullable<RoleFormDataQuery['roles']['nodes'][0]>;
  permissions: NonNullable<RoleFormDataQuery['permissions']['nodes'][0]>[];
  onSuccess?: IRoleFormOnSuccessFn;
}

function RoleFormContent(props: IRoleFormContentProps) {
  const { role, permissions, onSuccess } = props;
  const { api, me } = useContext(ApiContext);

  const [isDirty, setIsDirty] = useState(false);
  const submitCb = useCallback(async (vars: RoleFormUpdateMutationVariables): Promise<IRoleFormOnSuccessFnArg> => {
    const result = await api
      .connector
      .graphql<RoleFormUpdateMutation, RoleFormUpdateMutationVariables>(roleFormUpdateMutation, vars)
      .catch(rethrow(normaliseApiException));
    return {
      id: result.updateRole.data.id,
      name: result.updateRole.data.name,
    };
  }, [api])
  const [submit, submitState] = useMutation<IRoleFormOnSuccessFnArg, ApiException, RoleFormUpdateMutationVariables>(
    submitCb,
    { onSuccess, }
  );

  interface IRolePermissionListItem { id: Id; name: string };
  const incomingPermissionsList = useMemo<IListBuilderLists<IRolePermissionListItem>>(
    (): IListBuilderLists<IRolePermissionListItem> => {
      const current: IListBuilderItem<IRolePermissionListItem>[] = role
        .relations
        .permissions
        .nodes
        .filter(ist.notNullable)
        .map((permission): IListBuilderItem<IRolePermissionListItem> => ({
          disabled: !permission.can.createRolePermission,
          data: {
            id: permission.data.id,
            name: permission.data.name,
          },
        }))
        .sort((a, b) => Number(a.data.id) - Number(b.data.id));
      const currentIds = new Set(current.map(itm => itm.data.id));
      const available: IListBuilderItem<IRolePermissionListItem>[] = permissions
        .filter(permission => !currentIds.has(permission.data.id))
        .map((permission): IListBuilderItem<IRolePermissionListItem> => ({
          disabled: !permission.can.createRolePermission,
          data: {
            id: permission.data.id,
            name: permission.data.name,
          },
        }))
        .sort((a, b) => Number(a.data.id) - Number(b.data.id));
      return [available, current];
    },
    [role, permissions],
  );

  const [permissionLists, setPermissionLists] = useState(incomingPermissionsList);
  // when the incoming list updates, reset to it...
  useUpdate(() => {
    // @TODO: stop incoming permission change from overriding current session...
    setPermissionLists(incomingPermissionsList);
  }, [incomingPermissionsList]);

  const permissionListConfig = useMemo<IListBuilderConfig<IRolePermissionListItem>>(() => ({
    names: ['Available', 'Permissions'],
    key: ({ list, index, item }) => item.data.id,
    accessor: ({ list, index, item }) => (
      <Box color={ring(DashColours, Math.floor(Number(item.data.id) / 100))}>
        {`${item.data.id.toString().padStart(4, ' ')} - ${item.data.name}`}
      </Box>
    ),
  }), []);

  const handlePermissionListsChange: IListBuilderOnChangeFn<IRolePermissionListItem> = useCallback(
    ({ lists }) => {
      setIsDirty(true);
      setPermissionLists([
        Array.from(lists[0]).sort((a, b) => Number(a.data.id) - Number(b.data.id)),
        Array.from(lists[1]).sort((a, b) => Number(a.data.id) - Number(b.data.id)),
      ]);
    },
    [],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    submit({
      id: role.data.id,
      name: role.data.name,
      permission_ids: permissionLists[1].map(perm => Number(perm.data.id)),
    });
  }, [submit, role.data.id, permissionLists]);

  const isDisabled = submitState.isLoading || !role.can.update;
  const isLoading = submitState.isLoading;
  const error = submitState.error;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ListBuilder
                onChange={handlePermissionListsChange}
                disabled={isDisabled}
                error={error}
                config={permissionListConfig}
                lists={permissionLists}
              />
            </Grid>
            {error?.data?.permission_ids && (
              <Grid className="centered col" item xs={12} sm={12}>
                <FormHelperText error>
                  {error.data.permission_ids.join('\n')}
                </FormHelperText>
              </Grid>
            )}
            <Grid className="centered col" item xs={12} sm={12}>
              <Button variant="outlined" disabled={isDisabled || !isDirty} type="submit">
                Save
              </Button>
            </Grid>
            <Grid className="centered col" item xs={12} sm={12}>
              <FilledCircularProgress active={isLoading} />
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12} sm={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            <DebugException centered exception={error} />
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}