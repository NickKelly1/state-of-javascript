import { Grid, CircularProgress } from "@material-ui/core";
import React from "react";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { DebugException } from "../../components/debug-exception/debug-exception";
import { NotFound } from "../../components/not-found/not-found";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { OrNullable } from "../../types/or-nullable.type";

export interface IWithLoadableProps<T> {
  isLoading: boolean;
  error?: OrNullable<IApiException>;
  data?: OrNullable<T>;
  children: (data: T) => INodeable,
}

export function WithLoadable<T>(props: IWithLoadableProps<T>) {
  const {
    children,
    isLoading,
    data,
    error,
  } = props;

  const _isLoading = isLoading && (
    <Grid className="centered" item xs={12}>
      <CircularProgress />
    </Grid>
  );

  const _error = error && (
    <Grid item xs={12}>
      <DebugException centered always exception={error} />
    </Grid>
  );

  const _data = data && (
    <Grid item xs={12}>
      {nodeify(children(data))}
    </Grid>
  );

  const _notFound = !_isLoading && !_error && !_data && (
    <Grid item xs={12}>
      <NotFound />
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {_isLoading}
      {_error}
      {_data}
      {_notFound}
    </Grid>
  );
}