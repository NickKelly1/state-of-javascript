import {
  Box,
  Button,
  FormHelperText,
  Grid,
} from "@material-ui/core";
import {
  gql,
} from "graphql-request";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
} from "react-query";
import {
  ApiException,
} from "../../backend-api/api.exception";
import {
  RoleRolePermissionFormUpdateMutation,
  RoleRolePermissionFormUpdateMutationVariables,
  RoleRolePermissionsFormDataQuery,
  RoleRolePermissionsFormDataQueryVariables,
} from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import {
  Id,
} from "../../types/id.type";
import {
  IListBuilderItem,
  IListBuilderLists,
  IListBuilderOnChangeFn,
  IListBuilderConfig,
  ListBuilder,
} from "../list-builder/list-builder";
import { useUpdate } from "../../hooks/use-update.hook";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { IOnErrorFn } from "../../types/on-error-fn.type";
import { useSnackbar } from "notistack";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { ExceptionButton } from "../exception-button/exception-button.helper";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";


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

export const RoleRolePermissionForm = WithApi<IRoleRolePermissionFormProps>((props) => {
  const { role_id, onSuccess, onError, api, me } = props;

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
  const _role = roles?.[0];
  const contentData = useMemo(() => (_role && permissions?.length) ? ({ _role, permissions }) : undefined, [_role, permissions]);

  return (
    <WithLoadable error={error} isLoading={isLoading} data={contentData}>
      {(defContentData) => (
        <RoleRolePermissionFormContent
          role={defContentData._role}
          permissions={defContentData.permissions}
          onSuccess={onSuccess}
        />
      )}
    </WithLoadable>
  );
});


interface IRoleRolePermissionFormContentProps {
  role: NonNullable<RoleRolePermissionsFormDataQuery['roles']['nodes'][0]>;
  permissions: NonNullable<RoleRolePermissionsFormDataQuery['permissions']['nodes'][0]>[];
  onSuccess?: IRoleRolePermissionFormOnSuccessFn;
  onError?: IOnErrorFn;
}


const RoleRolePermissionFormContent = WithApi<IRoleRolePermissionFormContentProps>((props) => {
  const { role, permissions, onSuccess, onError, api, me, } = props;

  const [isDirty, setIsDirty] = useState(false);

  const { enqueueSnackbar, } = useSnackbar();

  const handleSuccess: IRoleRolePermissionFormOnSuccessFn = useCallback((arg) => {
    enqueueSnackbar(`Updated role "${arg.name}"`, { variant: 'success', });
    onSuccess?.(arg);
  }, [enqueueSnackbar, onSuccess]);

  const handleError: IOnErrorFn = useCallback((arg) => {
    enqueueSnackbar(`Failed to Update Role "${arg.message}"`, { variant: 'error' });
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

  interface IRolePermissionListItem { id: number; name: string, category: { id: number; name: string; colour: string; } }
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
        .sort(sortList);
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
                <ExceptionButton exception={error} />
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
})
