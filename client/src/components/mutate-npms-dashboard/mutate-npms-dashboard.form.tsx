import { Box, Button, CircularProgress, FormHelperText, Grid, InputLabel, makeStyles, Modal, Paper, TextField, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import clsx from 'clsx';
import { gql } from 'graphql-request';
import React, { FormEventHandler, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { normaliseApiException, rethrow } from '../../backend-api/make-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../contexts/api.context';
import { CreateNpmsDashboardFormMutation, CreateNpmsDashboardFormMutationVariables, UpdateNpmsDashboardFormMutation, UpdateNpmsDashboardFormMutationVariables } from '../../generated/graphql';
import { ist } from '../../helpers/ist.helper';
import { useSequence } from '../../hooks/use-sequence.hook';
import { Id } from '../../types/id.type';
import { OrNull } from '../../types/or-null.type';
import { MutateNpmsPackageForm, IMutateNpmsPackageFormOnSuccessFn } from '../mutate-npms-package/mutate-npms-package.form';
import { INpmsPackageSearchOption, NpmsPackageComboSearch } from '../npms-package-combo-search/npms-package-combo-search';

// TODO: updating vs creating...
const CreateNpmsDashboardQuery = gql`
mutation CreateNpmsDashboardForm(
  $name:String!,
  $npms_package_ids:[Int!]
){
  createNpmsDashboard(
    dto:{
      name:$name
      npms_package_ids:$npms_package_ids
    }
  ){
    cursor
    can{
      show
      update
      delete
    }
    data{
      id
      name
    }
  }
}
`;

const UpdateNpmsDashboardQuery = gql`
mutation UpdateNpmsDashboardForm(
  $id:Int!,
  $name:String!
  $npms_package_ids:[Int!]
){
  updateNpmsDashboard(
    dto:{
      id:$id,
      name:$name,
      npms_package_ids:$npms_package_ids
    }
  ){
    cursor
    can{
      show
      update
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


export interface IMutateNpmsDashboardFormOnSuccessFnArg { id: Id; name: string; };
export interface IMutateNpmsDashboardFormOnSuccessFn {
  (result: IMutateNpmsDashboardFormOnSuccessFnArg): any;
}
export interface IMutateNpmsDashboardFormProps {
  title: string;
  onSuccess?: IMutateNpmsDashboardFormOnSuccessFn;
  initial?: {
    id: Id;
    name: string;
    packages: INpmsPackageSearchOption[];
  },
}

interface IDashboardPackageOption { key: string; option: OrNull<INpmsPackageSearchOption>; };

export function MutateNpmsDashboardForm(props: IMutateNpmsDashboardFormProps) {
  const { onSuccess, initial, title } = props;
  const classes = useStyles();
  const { api, me } = useContext(ApiContext);
  const seq = useSequence();

  const _initial = useMemo(() => initial, []);
  const [dashboardName, setDashboardName] = useState(_initial?.name ?? '');
  const [packages, setPackages] = useState<IDashboardPackageOption[]>(() => [
    ...(_initial?.packages ?? []).map((option): IDashboardPackageOption => ({ key: seq.next().toString(), option, })),
    { key: seq.next().toString(), option: null, },
  ]);

  const addPackage = useCallback((option: OrNull<INpmsPackageSearchOption>) => setPackages((prev) => {
    const next = [
      ...prev,
      { key: seq.next().toString(), option, },
    ];
    return next;
  }), []);

  const changePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => setPackages((prev) => {
    const before = prev.slice(0, index);
    const after = prev.slice(index + 1, prev.length);
    const target = prev[index];
    const next: IDashboardPackageOption[] = [ ...before, { key: target.key, option }, ...after, ];
    return next;
  }), []);

  const removePackage = useCallback((index: number) => setPackages((prev) => {
    const before = prev.slice(0, index);
    const after = prev.slice(index + 1, prev.length);
    const next = [ ...before, ...after, ];
    return next;
  }), []);

  const handleChangePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => {
    if (ist.nullable(option)) return void removePackage(index);
    return void changePackage(index, option);
  }, [changePackage, removePackage]);

  const [createNpmsPackageModalOpen, setCreateNpmsPackageModalOpen] = useState(false);

  const handleNpmsPackageCreated: IMutateNpmsPackageFormOnSuccessFn = useCallback((result) => {
    setPackages((prev): IDashboardPackageOption[] => {
      const option: INpmsPackageSearchOption = { id: result.createNpmsPackage.data.id, name: result.createNpmsPackage.data.name };
      // initialise
      if (prev.length === 0) {
        const key = seq.next().toString();
        const nextOption: IDashboardPackageOption = { key, option };
        return [
          nextOption,
          { key: seq.next().toString(), option: null },
        ];
      }

      const before = prev.slice(0, prev.length - 1);
      const last = prev[prev.length - 1];

      // last option is null - fill it & add another
      if (ist.nullable(last.option)) {
        return [
          ...before,
          { ...last, option },
          { key: seq.next().toString(), option: null },
        ];
      }

      return [
        ...before,
        last,
        { key: seq.next().toString(), option },
        { key: seq.next().toString(), option: null },
      ];

    });
    setCreateNpmsPackageModalOpen(false);
  }, []);
  

  interface ISubmitFnArgs { name: string; npms_package_ids: number[]; }
  const [submitForm, formState] = useMutation<IMutateNpmsDashboardFormOnSuccessFnArg, IApiException, ISubmitFnArgs>(
    async (arg: ISubmitFnArgs) => {
      if (ist.nullable(_initial)) {
        // create
        const vars: CreateNpmsDashboardFormMutationVariables = {
          name: arg.name,
          npms_package_ids: arg.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<CreateNpmsDashboardFormMutation, CreateNpmsDashboardFormMutationVariables>(
            CreateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: IMutateNpmsDashboardFormOnSuccessFnArg = {
          id: result.createNpmsDashboard.data.id,
          name: result.createNpmsDashboard.data.name,
        }
        return final;
      }

      else {
        // update
        const vars: UpdateNpmsDashboardFormMutationVariables = {
          id: Number(_initial.id),
          name: arg.name,
          npms_package_ids: arg.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<UpdateNpmsDashboardFormMutation, UpdateNpmsDashboardFormMutationVariables>(
            UpdateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: IMutateNpmsDashboardFormOnSuccessFnArg = {
          id: result.updateNpmsDashboard.data.id,
          name: result.updateNpmsDashboard.data.name,
        }
        return final;
      }
    },
    { onSuccess, },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    submitForm({
      name: dashboardName,
      npms_package_ids: packages.map(pkg => pkg.option?.id).filter(ist.notNullable).map(Number),
    });
  }, [packages, dashboardName]);

  const isDisabled = formState.isLoading;
  const error = formState.error;

  return (
    <>
      <Modal
        open={createNpmsPackageModalOpen}
        onClose={() => setCreateNpmsPackageModalOpen(false)}
        className="modal"
        aria-labelledby="edit-dashboard"
        aria-describedby="edit-dashboard"
      >
        <Paper className={clsx('modal-content', classes.paper)}>
          <MutateNpmsPackageForm onSuccess={handleNpmsPackageCreated} />
        </Paper>
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h2">
                  {title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <InputLabel className={classes.label} htmlFor="create_npms_dashboard_name">name</InputLabel>
                <TextField
                  id="create_npms_dashboard_name"
                  disabled={isDisabled}
                  value={dashboardName}
                  error={!!error?.data?.name}
                  helperText={error?.data?.name?.join('\n')}
                  onChange={(evt) => { setDashboardName(evt.target.value); }}
                />
                {_initial && (
                  <FormHelperText>
                    {`formerly ${_initial.name}`}
                  </FormHelperText>
                )}
              </Grid>
              {packages.map((pkg, i) => (
                <Grid key={pkg.key} item xs={12}>
                  <NpmsPackageComboSearch
                    option={pkg.option}
                    error={!!error?.data?.npms_package_ids}
                    isDisabled={isDisabled}
                    onChange={(option) => {
                      handleChangePackage(i, option);
                      if (i === (packages.length - 1) && option) {
                        addPackage(null);
                      }
                    }}
                  />
                </Grid>
              ))}
              {formState.error
                && formState.error.data?.npms_package_ids
                && formState.error.data.npms_package_ids.map((desc, i) => (
                  <FormHelperText key={`${desc}${i.toString()}`} error>
                    {desc}
                  </FormHelperText>
                ))
              }
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setCreateNpmsPackageModalOpen(true)}
                  className="centered text-center"
                >
                  <Box className="centered" mr={2}>
                    <AddCircleOutlineIcon />
                  </Box>
                  <Box>
                    Link a new package
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  type="submit">
                  Submit
                </Button>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <FormHelperText className="centered" error>
                    {error.message}
                  </FormHelperText>
                </Grid>
              )}
              {isDisabled && (
                <Grid item xs={12} sm={12}>
                  <CircularProgress />
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}