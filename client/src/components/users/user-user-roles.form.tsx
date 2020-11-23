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
  UserUserRolesFormUpdateMutation,
  UserUserRolesFormUpdateMutationVariables,
  UserUserRolesFormDataQuery,
  UserUserRolesFormDataQueryVariables,
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
import { useSnackbar } from "notistack";
import { flsx } from "../../helpers/flsx.helper";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { IOnErrorFn } from "../../types/on-error-fn.type";


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

export function UserUserRolesForm(props: IUserUserRolesFormProps) {
  const { user_id, onSuccess, onError } = props;
  const { api, me, } = useContext(ApiContext);

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
        const result = await api
          .connector
          .graphql<UserUserRolesFormDataQuery, UserUserRolesFormDataQueryVariables>(
            userUserRolesFormDataQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException))
        return result;
      },
  );

  const users = useMemo(() => data?.users.nodes.filter(ist.notNullable), [data?.users]);
  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);

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
      {users?.length === 0 && (
        <Grid item xs={12}>
          <NotFound message={`Role "${user_id}" not found`} />
        </Grid>
      )}
      {roles && users?.length === 1 && (
        <Grid item xs={12}>
          <UserUserRolesFormContent
            user={users[0]}
            roles={roles}
            onError={onError}
            onSuccess={onSuccess}
          />
        </Grid>
      )}
    </Grid>
  );
}


interface IUserUserRolesFormContentProps {
  user: NonNullable<UserUserRolesFormDataQuery['users']['nodes'][0]>;
  roles: NonNullable<UserUserRolesFormDataQuery['roles']['nodes'][0]>[];
  onSuccess?: IUserUserRolesFormOnSuccessFn;
  onError?: IOnErrorFn;
}


function UserUserRolesFormContent(props: IUserUserRolesFormContentProps) {
  const { user, roles, onSuccess, onError, } = props;
  const { api, me } = useContext(ApiContext);
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
      const result = await api
        .connector
        .graphql<UserUserRolesFormUpdateMutation, UserUserRolesFormUpdateMutationVariables>(
          userUserRolesFormMutationUpdateMutation,
          vars,
        )
        .catch(rethrow(normaliseApiException));
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

  interface IUserRoleListItem { id: Id; name: string };
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
