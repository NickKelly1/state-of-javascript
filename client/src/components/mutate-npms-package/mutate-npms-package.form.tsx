import { Button, CircularProgress, FormHelperText, Grid, InputLabel, makeStyles, Modal, Paper, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { gql } from 'graphql-request';
import React, { FormEventHandler, useCallback, useContext, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { normaliseApiException, rethrow } from '../../backend-api/make-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../contexts/api.context';
import { CreateNpmsPackageFormMutation, CreateNpmsPackageFormMutationVariables } from '../../generated/graphql';
import { pretty } from '../../helpers/pretty.helper';

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
      delete
    }
    data{
      id
      name
    }
  }
}
`;

const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
  paper: {
    padding: theme.spacing(2),
  },
  label: {
    paddingBottom: theme.spacing(1),
  },
  group: {
    marginBottom: theme.spacing(2),
  },
}));

export interface IMutateNpmsPackageFormOnSuccessFn {
  (result: CreateNpmsPackageFormMutation): any;
}

export interface ICreateNpmsPackageFormProps {
  onSuccess?: IMutateNpmsPackageFormOnSuccessFn;
  className?: string;
}

export function MutateNpmsPackageForm(props: ICreateNpmsPackageFormProps) {
  const { onSuccess, className } = props;
  const { api, me, } = useContext(ApiContext);
  const classes = useStyles();
  const seq = useRef(0);
  const [formData, setFormData] = useState<CreateNpmsPackageFormMutationVariables>(({ name: '' }));

  const [submitForm, formState] = useMutation<CreateNpmsPackageFormMutation, IApiException, CreateNpmsPackageFormMutationVariables>(
    async (vars: CreateNpmsPackageFormMutationVariables) => {
      const result = await api
        .connector
        .graphql<CreateNpmsPackageFormMutation, CreateNpmsPackageFormMutationVariables>(
          createNpmsPackageQuery,
          vars,
        )
        .catch(rethrow(normaliseApiException));
      return result;
    },
    { onSuccess, }
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    submitForm(formData);
  }, [formData]);

  const isDisabled = formState.isLoading;
  const error = formState.error;

  return (
    <Grid className={clsx(classes.root, className, 'text-center')} container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h2">
          Link NPM package
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid className={clsx(classes.root, className)} container spacing={2}>
            <Grid item xs={12}>
              <InputLabel className={classes.label} htmlFor="create_npms_package_name">name</InputLabel>
              {/* <Input */}
              <TextField
                id="create_npms_package_name"
                disabled={isDisabled}
                value={formData.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                inputProps={{ className: 'text-center', }}
                onChange={(evt) => {
                  const value = evt.target.value;
                  setFormData((prev) => ({ ...prev, name: value }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                type="submit">
                Submit
              </Button>
            </Grid>
            {isDisabled && (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <FormHelperText className="centered" error>
                  {void console.log('supppp', error)}
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}