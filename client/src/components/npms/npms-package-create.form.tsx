import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import { gql } from 'graphql-request';
import React, {
  useCallback,
  useState
} from 'react';
import { useMutation } from 'react-query';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { IWithDialogueProps, WithDialogue } from '../../components-hoc/with-dialog/with-dialog';
import { CreateNpmsPackageFormMutation, CreateNpmsPackageFormMutationVariables } from '../../generated/graphql';
import { change } from '../../helpers/change.helper';
import { useSubmitForm } from '../../hooks/use-submit-form.hook';

const createNpmsPackageQuery = gql`
mutation CreateNpmsPackageForm(
  $name:String!
){
  createNpmsPackage(
    dto:{
      name:$name
    }
  ){
    cursor
    can{
      show
      softDelete
      hardDelete
    }
    data{
      id
      name
    }
  }
}
`;


export interface INpmsPackageCreateFormOnSuccessFn {
  (result: CreateNpmsPackageFormMutation): any;
}


export interface INpmsPackageCreateFormProps extends IWithDialogueProps {
  onSuccess?: INpmsPackageCreateFormOnSuccessFn;
  className?: string;
}


export const NpmsPackageCreateForm = WithDialogue<INpmsPackageCreateFormProps>({ fullWidth: true })(WithApi((props) => {
  const { dialog, onSuccess, className, api, me } = props;
  const [formState, setFormState] = useState<CreateNpmsPackageFormMutationVariables>(({ name: '' }));
  const [doSubmit, submitState] = useMutation<CreateNpmsPackageFormMutation, IApiException>(
    async () => {
      const vars: CreateNpmsPackageFormMutationVariables = {
        name: formState.name,
      };
      const result = await api.gql<CreateNpmsPackageFormMutation, CreateNpmsPackageFormMutationVariables>(
        createNpmsPackageQuery,
        vars,
      );
      return result;
    },
    { onSuccess, }
  );
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleChangeName = useCallback(change(setFormState, 'name'), [setFormState]);

  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <>
      <DialogTitle>Link NPM Package</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                fullWidth
                autoFocus
                margin="dense"
                disabled={isDisabled}
                value={formState.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                onChange={handleChangeName}
              />
            </Grid>
            <Grid item xs={12}>
            </Grid>
            {isDisabled && (
              <Grid className="centered" item xs={12}>
                <CircularProgress />
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <FormHelperText className="centered" error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}));
