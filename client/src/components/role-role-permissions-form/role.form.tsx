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
import React, {
  FormEventHandler,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  TypedQueryFunction,
  useMutation,
  useQuery,
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
  RoleRolePermissionFormUpdateMutation,
  RoleRolePermissionFormUpdateMutationVariables,
  RoleRolePermissionsFormDataQuery,
  RoleRolePermissionsFormDataQueryVariables,
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
import { Api } from "../../backend-api/api";
import { IMeHash } from "../../backend-api/api.me";


const RoleRolePermissionsFormDataQueryName = (id: Id) => `RoleRolePermissionsFormDataQuery_${id}`;
const roleRolePermissionsFormDataQuery = gql`
query RoleRolePermissionsFormData(
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


// const roleFormCreateMutation = gql`
// mutation RoleFormCreate(
//   $name:String!
//   $permission_ids:[Int!]
// ){
//   createRole(
//     dto:{
//       name:$name
//       permission_ids:$permission_ids
//     }
//   ){
//     can{
//       show
//       update
//       delete
//       createRolePermission
//     }
//     data{
//       id
//       name
//     }
//     relations{
//       permissions{
//         nodes{
//           can{
//             show
//             createRolePermission
//           }
//           data{
//             id
//             name
//           }
//         }
//       }
//     }
//   }
// }
// `;


const rolePermissionFormUpdateMutation = gql`
mutation RoleRolePermissionFormUpdate(
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


export interface IRoleRolePermissionFormOnSuccessFnArg { id: Id; name: string; }
export interface IRoleRolePermissionFormOnSuccessFn {
  (arg: IRoleRolePermissionFormOnSuccessFnArg): any;
}

export interface IRoleRolePermissionFormProps {
  role_id: Id;
  onSuccess?: IRoleRolePermissionFormOnSuccessFn;
}

export function RoleRolePermissionForm(props: IRoleRolePermissionFormProps) {
  const { role_id, onSuccess } = props;
  const { api, me, } = useContext(ApiContext);

  const [vars, setVars] = useState<RoleRolePermissionsFormDataQueryVariables>(() => ({
    id: Number(role_id),
    permissionsLimit: 10_000,
    permissionsOffset: 0,
    rolesPermissionsLimit: 10_000,
    rolesPermissionsOffset: 0,
  }));

  const {
    data,
    refetch,
    isLoading,
    error,
  } = useQuery<RoleRolePermissionsFormDataQuery, ApiException>(
    [RoleRolePermissionsFormDataQueryName(role_id), vars, me?.hash],
    async (): Promise<RoleRolePermissionsFormDataQuery> => {
        const result = await api
          .connector
          .graphql<RoleRolePermissionsFormDataQuery, RoleRolePermissionsFormDataQueryVariables>(
            roleRolePermissionsFormDataQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException))
        return result;
      },
  );

  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);
  const permissions = useMemo(() => data?.permissions.nodes.filter(ist.notNullable), [data?.permissions]);

  return (
    <Grid container spacing={2}>
      {error && (
        <Grid item xs={12}>
          <DebugException centered always exception={error} />
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
          <RoleRolePermissionFormContent
            role={roles[0]}
            permissions={permissions}
            onSuccess={onSuccess}
          />
        </Grid>
      )}
    </Grid>
  );
}


interface IRoleRolePermissionFormContentProps {
  role: NonNullable<RoleRolePermissionsFormDataQuery['roles']['nodes'][0]>;
  permissions: NonNullable<RoleRolePermissionsFormDataQuery['permissions']['nodes'][0]>[];
  onSuccess?: IRoleRolePermissionFormOnSuccessFn;
}


function RoleRolePermissionFormContent(props: IRoleRolePermissionFormContentProps) {
  const { role, permissions, onSuccess } = props;
  const { api, me } = useContext(ApiContext);

  const [isDirty, setIsDirty] = useState(false);
  const submitCb = useCallback(async (vars: RoleRolePermissionFormUpdateMutationVariables): Promise<IRoleRolePermissionFormOnSuccessFnArg> => {
    const result = await api
      .connector
      .graphql<RoleRolePermissionFormUpdateMutation, RoleRolePermissionFormUpdateMutationVariables>(
        rolePermissionFormUpdateMutation,
        vars,
      )
      .catch(rethrow(normaliseApiException));
    return {
      id: result.updateRole.data.id,
      name: result.updateRole.data.name,
    };
  }, [api])
  const [submit, submitState] = useMutation<IRoleRolePermissionFormOnSuccessFnArg, ApiException, RoleRolePermissionFormUpdateMutationVariables>(
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
