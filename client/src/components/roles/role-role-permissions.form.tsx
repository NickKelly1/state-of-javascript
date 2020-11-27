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
} from "../../components-contexts/api.context";
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
import { useUpdate } from "../../hooks/use-update.hook";
import { DebugException } from "../debug-exception/debug-exception";
import { ring } from "../../helpers/ring.helper";
import { DashColours } from "../../dashboard-theme";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { Api } from "../../backend-api/api";
import { IMeHash } from "../../backend-api/api.me";
import { IConstructor } from "../../types/constructor.interface";
import { IIdentityFn } from "../../types/identity-fn.type";
import { IOnErrorFn } from "../../types/on-error-fn.type";
import { useSnackbar } from "notistack";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";


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
        createRolePermissions
        hardDeleteRolePermissions
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
              createRolePermissions
              hardDeleteRolePermissions
            }
            data{
              id
              name
            }
            relations{
              category{
                data{
                  id
                  name
                  colour
                }
              }
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
        createRolePermissions
        hardDeleteRolePermissions
      }
      data{
        id
        name
      }
      relations{
        category{
          data{
            id
            name
            colour
          }
        }
      }
    }
  }
}
`;


const rolePermissionFormUpdateUpdateMutation = gql`
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
    data{
      id
      name
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
  onError?: IOnErrorFn;
}

export function RoleRolePermissionForm(props: IRoleRolePermissionFormProps) {
  const { role_id, onSuccess, onError, } = props;
  const { api, me, } = useContext(ApiContext);

  const [vars, setVars] = useState<RoleRolePermissionsFormDataQueryVariables>(() => ({
    id: Number(role_id),
    permissionsLimit: 10_000,
    permissionsOffset: 0,
    rolesPermissionsLimit: 10_000,
    rolesPermissionsOffset: 0,
  }));

  const { data, refetch, isLoading, error, } = useQuery<RoleRolePermissionsFormDataQuery, ApiException>(
    [RoleRolePermissionsFormDataQueryName(role_id), vars, me?.hash],
    async (): Promise<RoleRolePermissionsFormDataQuery> => {
        const result = await api.gql<RoleRolePermissionsFormDataQuery, RoleRolePermissionsFormDataQueryVariables>(
          roleRolePermissionsFormDataQuery,
          vars,
        );
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
          <NotFound message={`Role "${role_id}" not found`} />
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
  onError?: IOnErrorFn;
}


function RoleRolePermissionFormContent(props: IRoleRolePermissionFormContentProps) {
  const { role, permissions, onSuccess, onError } = props;
  const { api, me } = useContext(ApiContext);

  const [isDirty, setIsDirty] = useState(false);

  const { enqueueSnackbar, } = useSnackbar();

  const handleSuccess: IRoleRolePermissionFormOnSuccessFn = useCallback((arg) => {
    enqueueSnackbar(`Updated role "${arg.name}"`, { variant: 'success', });
    onSuccess?.(arg);
  }, [enqueueSnackbar, onSuccess]);

  const handleError: IOnErrorFn = useCallback((arg) => {
    enqueueSnackbar(`Failed to update role "${arg.name}"`, { variant: 'error' });
    onError?.(arg);
  }, [onError, role]);

  const [doSubmit, submitState] = useMutation<IRoleRolePermissionFormOnSuccessFnArg, ApiException>(
    async (): Promise<IRoleRolePermissionFormOnSuccessFnArg> => {
      const vars: RoleRolePermissionFormUpdateMutationVariables = {
        id: role.data.id,
        permission_ids: permissionLists[1].map(perm => Number(perm.data.id)),
      };
      const result = await api.gql<RoleRolePermissionFormUpdateMutation, RoleRolePermissionFormUpdateMutationVariables>(
        rolePermissionFormUpdateUpdateMutation,
        vars,
      );
      return {
        id: result.updateRole.data.id,
        name: result.updateRole.data.name,
      };
    },
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  );

  interface IRolePermissionListItem { id: number; name: string, category: { id: number; name: string; colour: string; } };
  const sortList = useCallback((a: IListBuilderItem<IRolePermissionListItem>, b: IListBuilderItem<IRolePermissionListItem>): number => {
    const byCategory = a.data.category.id - b.data.category.id;
    if (byCategory !== 0) return byCategory;
    const byId = a.data.id - b.data.id;
    return byId;
  }, []);
  const incomingPermissionsList = useMemo<IListBuilderLists<IRolePermissionListItem>>(
    (): IListBuilderLists<IRolePermissionListItem> => {
      const current: IListBuilderItem<IRolePermissionListItem>[] = role
        .relations
        .permissions
        .nodes
        .filter(ist.notNullable)
        .map((permission): IListBuilderItem<IRolePermissionListItem> => ({
          // TODO: check if can DELETE rolePermission too....
          disabled: !(permission.can.createRolePermissions && permission.can.hardDeleteRolePermissions),
          data: {
            id: permission.data.id,
            name: permission.data.name,
            category: {
              colour: permission.relations.category?.data.colour ?? 'red',
              id: permission.relations.category?.data.id ?? -1,
              name: permission.relations.category?.data.name ?? '_unknown_',
            },
          },
        }))
        .sort((a, b) => sortList(a, b));
      const currentIds = new Set(current.map(itm => itm.data.id));
      const available: IListBuilderItem<IRolePermissionListItem>[] = permissions
        .filter(permission => !currentIds.has(permission.data.id))
        .map((permission): IListBuilderItem<IRolePermissionListItem> => ({
          disabled: !(permission.can.createRolePermissions && permission.can.hardDeleteRolePermissions),
          data: {
            id: permission.data.id,
            name: permission.data.name,
            category: {
              colour: permission.relations.category?.data.colour ?? 'red',
              id: permission.relations.category?.data.id ?? -1,
              name: permission.relations.category?.data.name ?? '_unknown_',
            },
          },
        }))
        .sort(sortList);
      return [available, current];
    },
    [role, permissions, sortList],
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
      <Box style={{ color: item.data.category.colour }}>
        {`${item.data.category.name} - ${item.data.name}`}
      </Box>
    ),
  }), []);

  const handlePermissionListsChange: IListBuilderOnChangeFn<IRolePermissionListItem> = useCallback(
    ({ lists }) => {
      setIsDirty(true);
      setPermissionLists([
        Array.from(lists[0]).sort(sortList),
        Array.from(lists[1]).sort(sortList),
      ]);
    },
    [sortList],
  );

  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const isDisabled = submitState.isLoading || !(role.can.createRolePermissions && role.can.hardDeleteRolePermissions);
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
              <Button variant="outlined" disabled={isDisabled || !isDirty} type="submit" color="primary">
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
