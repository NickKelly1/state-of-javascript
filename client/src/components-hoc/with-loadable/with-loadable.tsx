import { Grid, CircularProgress } from "@material-ui/core";
import React from "react";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ExceptionButton } from "../../components/exception-button/exception-button.helper";
import { NotFound } from "../../components/not-found/not-found";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { OrNullable } from "../../types/or-nullable.type";

export interface IWithLoadableProps<T> {
  isLoading: boolean;
  error?: OrNullable<IApiException>;
  data?: OrNullable<T>;
  renderError?: (error: IApiException) => INodeable;
  renderLoading?: () => INodeable;
  children: (data: T) => INodeable,
}

export function WithLoadable<T>(props: IWithLoadableProps<T>): JSX.Element {
  const {
    children,
    isLoading,
    data,
    error,
    renderError,
    renderLoading,
  } = props;

  const _isLoading = isLoading && (
    <Grid className="centered" item xs={12}>
      {renderLoading && nodeify(renderLoading)}
      {!renderLoading && <CircularProgress />}
    </Grid>
  );

  const _error = error && (
    <Grid className="centered" item xs={12}>
      {renderError && nodeify(renderError)}
      {!renderError && <ExceptionButton exception={error} />}
    </Grid>
  );

  const _data = data && (
    <Grid className="centered" item xs={12}>
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
      {_data}
      {_error}
      {_isLoading}
      {_notFound}
    </Grid>
  );
}