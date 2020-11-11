import { Button, CircularProgress, FormHelperText, Grid, InputLabel, TextField } from "@material-ui/core";
import { gql } from "graphql-request";
import produce from "immer";
import React, { ChangeEventHandler, FormEventHandler, useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { ApiContext } from "../../contexts/api.context";
import { MutateRoleFormUpdateMutation, MutateRoleFormUpdateMutationVariables, MutateRoleFromCreateMutation, MutateRoleFromCreateMutationVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { useUpdate } from "../../hooks/use-update.hook";
import { Id } from "../../types/id.type";
import { OrNullable } from "../../types/or-nullable.type";

const mutateRoleFormCreateMutation = gql`
mutation MutateRoleFromCreate(
  $name:String!
){
  createRole(
    dto:{
      name:$name
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
  }
}
`;


const mutateRoleFormUpdateMutation = gql`
mutation MutateRoleFormUpdate(
  $id:Int!
  $name:String
){
  updateRole(
    dto:{
      id:$id
      name:$name
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
  }
}
`;

export interface IMutateRoleFormOnSuccessFnArg { id: Id; name: string };
export interface IMutateRoleFormOnSuccessFn { (arg: IMutateRoleFormOnSuccessFnArg): any }
export interface IMutateRoleFormRole { id: Id; name: string; };
export interface IMutateRoleFormProps {
  role?: OrNullable<IMutateRoleFormRole>;
  onSuccess?: IMutateRoleFormOnSuccessFn;
}

export function MutateRoleForm(props: IMutateRoleFormProps) {
  const { role, onSuccess, } = props;
  const { api, me, } = useContext(ApiContext);

  interface IFormState { name: string; };
  const [formState, setFormState] = useState<IFormState>(() => ({
    name: role?.name ?? '',
  }));

  const [submit, submitState] = useMutation<IMutateRoleFormOnSuccessFnArg, ApiException>(
    async () => {
        if (ist.notNullable(role)) {
        // update
        const vars: MutateRoleFormUpdateMutationVariables = {
          id: Number(role.id),
          name: formState.name,
        };

        const result = await api
          .connector
          .graphql<MutateRoleFormUpdateMutation, MutateRoleFormUpdateMutationVariables>(
            mutateRoleFormUpdateMutation,
            vars
          )
          .catch(rethrow(normaliseApiException));

        return {
          id: result.updateRole.data.id,
          name: result.updateRole.data.name,
        };
      }

      // create
      const vars: MutateRoleFromCreateMutationVariables = {
        name: formState.name,
      };

      const result = await api
        .connector
        .graphql<MutateRoleFromCreateMutation, MutateRoleFromCreateMutationVariables>(
          mutateRoleFormCreateMutation,
          vars
        )
        .catch(rethrow(normaliseApiException));

      return {
        id: result.createRole.data.id,
        name: result.createRole.data.name,
      };
    },
    { onSuccess, },
  )

  const handleNameChanged: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((evt) => {
    const value = evt.target.value;
    setFormState((prev) => produce<IFormState, IFormState, IFormState>(prev, (next) => {
      next.name = value;
      return next;
    }));
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    submit();
  }, [submit]);

  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel htmlFor="mutate_role_form_name">name</InputLabel>
              <TextField
                id="mutate_role_form_name"
                disabled={isDisabled}
                value={formState.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                onChange={handleNameChanged}
              />
            </Grid>
            <Grid className="centered col" item xs={12} sm={12}>
              <Button disabled={isDisabled} type="submit">
                Submit
              </Button>
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12} sm={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            {isDisabled && (
              <Grid className="centered col" item xs={12} sm={12}>
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
