import {
  Box,
  Button,
  CircularProgress,
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
  UserUserRolesFormUpdateMutation,
  UserUserRolesFormUpdateMutationVariables,
  UserUserRolesFormDataQuery,
  UserUserRolesFormDataQueryVariables,
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
import { NotFound } from "../not-found/not-found";
import { useUpdate } from "../../hooks/use-update.hook";
import { ExceptionDetail } from "../exception/exception-detail";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { useSnackbar } from "notistack";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { IOnErrorFn } from "../../types/on-error-fn.type";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { ExceptionButton } from "../exception-button/exception-button.helper";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";


const UserUserRolesFormDataQueryName = (id: Id) => `UserUserRolesFormDataQuery_${id}`;
const userUserRolesFormDataQuery = gql`
query UserUserRolesFormData(
  $id:Float!
  $userRolesLimit:Int!
  $userRolesOffset:Int!
  $rolesLimit:Int!
  $rolesOffset:Int!
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
    nodes{
      can{
        createUserRoles
        hardDeleteUserRoles
      }
      data{
        id
        name
			}
      relations{
        roles(
          query:{
            offset:$userRolesOffset
            limit:$userRolesLimit
            sorts:[
              {field:"id", dir:Asc}
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
              createUserRoles
              hardDeleteUserRoles
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
  roles(
    query:{
      limit:$rolesLimit
      offset:$rolesOffset
      sorts:[
        {field:"id", dir:Asc}
      ]
    }
  ){
    nodes{
      can{
        show
        createUserRoles
        hardDeleteUserRoles
      }
      data{
        id
        name
      }
    }
  }
}
`;


const userUserRolesFormMutationUpdateMutation = gql`
mutation UserUserRolesFormUpdate(
  $id:Int!
  $name:String
  $role_ids:[Int!]
){
  updateUser(
    dto:{
      id:$id
      name:$name
      role_ids:$role_ids
    }
  ){
    data{
      id
      name
    }
  }
}
`;


export interface IUserUserRolesFormOnSuccessFnArg { id: Id; name: string; }
export interface IUserUserRolesFormOnSuccessFn { (arg: IUserUserRolesFormOnSuccessFnArg): any; }

export interface IUserUserRolesFormProps {
  user_id: Id;
  onSuccess?: IUserUserRolesFormOnSuccessFn;
  onError?: IOnErrorFn;
}

export const UserUserRolesForm = WithApi<IUserUserRolesFormProps>((props) => {
  const { user_id, onSuccess, onError, api, me } = props;

  const [vars, setVars] = useState<UserUserRolesFormDataQueryVariables>(() => ({
    id: Number(user_id),
    rolesLimit: 10_000,
    rolesOffset: 0,
    userRolesLimit: 10_000,
    userRolesOffset: 0,
  }));

  const { data, refetch, isLoading, error, } = useQuery<UserUserRolesFormDataQuery, ApiException>(
    [UserUserRolesFormDataQueryName(user_id), vars, me?.hash],
    async (): Promise<UserUserRolesFormDataQuery> => {
        const result = await api.gql<UserUserRolesFormDataQuery, UserUserRolesFormDataQueryVariables>(
          userUserRolesFormDataQuery,
          vars,
        );
        return result;
      },
  );

  const users = useMemo(() => data?.users.nodes.filter(ist.notNullable), [data?.users]);
  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);
  const user = users?.[0];
  const contentData = useMemo(() => (user && roles?.length) ? ({ user, roles }) : undefined, [user, roles]);

  return (
    <WithLoadable error={error} isLoading={isLoading} data={contentData}>
      {(defContentData) => (
        <UserUserRolesFormContent
          user={defContentData.user}
          roles={defContentData.roles}
          onError={onError}
          onSuccess={onSuccess}
        />
      )}
    </WithLoadable>
  );
});


interface IUserUserRolesFormContentProps {
  user: NonNullable<UserUserRolesFormDataQuery['users']['nodes'][0]>;
  roles: NonNullable<UserUserRolesFormDataQuery['roles']['nodes'][0]>[];
  onSuccess?: IUserUserRolesFormOnSuccessFn;
  onError?: IOnErrorFn;
}


const UserUserRolesFormContent = WithApi<IUserUserRolesFormContentProps>((props) => {
  const { user, roles, onSuccess, onError, api, me, } = props;
  const { enqueueSnackbar, } = useSnackbar();

  const [isDirty, setIsDirty] = useState(false);

  const handleSuccess: IUserUserRolesFormOnSuccessFn = useCallback((arg) => {
    enqueueSnackbar(`Updated roles for "${user.data.name}"`, { variant: 'success' });
    onSuccess?.(arg);
  }, [onSuccess, enqueueSnackbar, user.data.name]);

  const handleError: IOnErrorFn = useCallback((arg) => {
    enqueueSnackbar(`Failed to updated roles for "${user.data.name}"`, { variant: 'error' });
    onError?.(arg);
  }, [onError, user.data.name])

  const [doSubmit, submitState] = useMutation<IUserUserRolesFormOnSuccessFnArg, ApiException>(
    async (): Promise<IUserUserRolesFormOnSuccessFnArg> => {
      const vars: UserUserRolesFormUpdateMutationVariables = {
        id: user.data.id,
        role_ids: roleLists[1].map(perm => Number(perm.data.id)),
      }
      const result = await api.gql<UserUserRolesFormUpdateMutation, UserUserRolesFormUpdateMutationVariables>(
        userUserRolesFormMutationUpdateMutation,
        vars,
      );
      return {
        id: result.updateUser.data.id,
        name: result.updateUser.data.name,
      };
    },
    {
      onSuccess: handleSuccess,
      onError: handleError,
    }
  );

  interface IUserRoleListItem { id: Id; name: string }
  const incomingPermissionsList = useMemo<IListBuilderLists<IUserRoleListItem>>(
    (): IListBuilderLists<IUserRoleListItem> => {
      const current: IListBuilderItem<IUserRoleListItem>[] = user
        .relations
        .roles
        .nodes
        .filter(ist.notNullable)
        .map((role): IListBuilderItem<IUserRoleListItem> => ({
          disabled: !(role.can.hardDeleteUserRoles && role.can.createUserRoles),
          data: {
            id: role.data.id,
            name: role.data.name,
          },
        }))
        .sort((a, b) => Number(a.data.id) - Number(b.data.id));
      const currentIds = new Set(current.map(itm => itm.data.id));
      const available: IListBuilderItem<IUserRoleListItem>[] = roles
        .filter(role => !currentIds.has(role.data.id))
        .map((role): IListBuilderItem<IUserRoleListItem> => ({
          disabled: !(role.can.hardDeleteUserRoles && role.can.createUserRoles),
          data: {
            id: role.data.id,
            name: role.data.name,
          },
        }))
        .sort((a, b) => Number(a.data.id) - Number(b.data.id));
      return [available, current];
    },
    [user, roles],
  );

  const [roleLists, setRoleLists] = useState(incomingPermissionsList);
  // when the incoming list updates, reset to it...
  useUpdate(() => {
    // @TODO: stop incoming role change from overriding current session...
    setRoleLists(incomingPermissionsList);
  }, [incomingPermissionsList]);

  const roleListConfig = useMemo<IListBuilderConfig<IUserRoleListItem>>(() => ({
    names: ['Available', 'Roles'],
    key: ({ list, index, item }) => item.data.id,
    accessor: ({ list, index, item }) => (
      <Box>
        {`${item.data.id.toString().padStart(4, ' ')} - ${item.data.name}`}
      </Box>
    ),
  }), []);

  const handlePermissionListsChange: IListBuilderOnChangeFn<IUserRoleListItem> = useCallback(
    ({ lists }) => {
      setIsDirty(true);
      setRoleLists([
        Array.from(lists[0]).sort((a, b) => Number(a.data.id) - Number(b.data.id)),
        Array.from(lists[1]).sort((a, b) => Number(a.data.id) - Number(b.data.id)),
      ]);
    },
    [],
  );

  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);

  // || !role.can.update;
  const isDisabled = submitState.isLoading || !(user.can.createUserRoles) || !(user.can.hardDeleteUserRoles);
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
                config={roleListConfig}
                lists={roleLists}
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
});
