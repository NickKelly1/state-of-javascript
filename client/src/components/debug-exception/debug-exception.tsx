import BugReportIcon from '@material-ui/icons/BugReport';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { ApiException } from "../../backend-api/api.exception";
import { DebugModeContext } from '../../contexts/debug-mode.context';
import { OrNullable } from '../../types/or-nullable.type';
import { JsonPretty } from '../json-pretty/json-pretty';
import { WhenDebugMode } from '../when-debug-mode/when-debug-mode';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));


interface IDebugExceptionProps {
  className?: OrNullable<string>
  exception?: OrNullable<ApiException>;
  centered?: boolean;
}

export function DebugException(props: IDebugExceptionProps) {
  const { exception, className, centered, } = props;
  const classes = useStyles();

  if (!exception) return null;

  const {
    name,
    error,
    message,
    code,
    data,
    stack,
    trace,
    ...other
  } = exception;

  const itemClassName = !!centered ? 'centered col' : undefined;

  return (
    <WhenDebugMode>
      <Grid className={clsx(classes.root, className)} container spacing={2}>
        <Grid className={itemClassName} item xs={12}>
          <Typography>
            Error debug info:
          </Typography>
        </Grid>
        {name && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Name:
            </Typography>
            <Typography variant="body2" color="error">
              {name}
            </Typography>
          </Grid>
        )}
        {error && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Error;
            </Typography>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Grid>
        )}
        {message && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Message:
            </Typography>
            <Typography variant="body2" color="error">
              {message}
            </Typography>
          </Grid>
        )}
        {code && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Code:
            </Typography>
            <Typography variant="body2" color="error">
              {code}
            </Typography>
          </Grid>
        )}
        {data && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Data:
            </Typography>
            <Typography variant="body2" color="error">
              <JsonPretty src={data} />
            </Typography>
          </Grid>
        )}
        {trace && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Trace:
            </Typography>
            <Typography variant="body2" color="error">
              {trace.map((tr, i) => (
                <div key={i}>
                  <span>
                    {tr}
                  </span>
                </div>
              ))}
            </Typography>
          </Grid>
        )}
        {stack && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Stack:
            </Typography>
            <Typography variant="body2" color="error">
              {stack.split('\n').map((tr, i) => (
                <div key={i}>
                  <span>
                    {tr}
                  </span>
                </div>
              ))}
            </Typography>
          </Grid>
        )}
        {!!Object.keys(other).length && (
          <Grid className={itemClassName} item xs={12}>
            <Typography variant="body2">
              Other:
            </Typography>
            <Typography variant="body2" color="error">
              <JsonPretty src={other} />
            </Typography>
          </Grid>
        )}
      </Grid>
    </WhenDebugMode>
  );
}