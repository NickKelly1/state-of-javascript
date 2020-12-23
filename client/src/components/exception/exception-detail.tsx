import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { ApiException } from "../../backend-api/api.exception";
import { OrNullable } from '../../types/or-nullable.type';
import { JsonPretty } from '../json-pretty/json-pretty';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));


interface IExceptionDetailProps {
  className?: OrNullable<string>
  exception?: OrNullable<ApiException>;
  centered?: boolean;
}

export function ExceptionDetail(props: IExceptionDetailProps): null | JSX.Element {
  const { exception, className, centered, } = props;
  const classes = useStyles();

  if (!exception) return null;

  const {
    name,
    message,
    code,
    data,
    stack,
    trace,
    ...other
  } = exception;

  const itemClassName = centered ? 'centered col' : undefined;

  return (
    <>
      <Box className={clsx('centered col', classes.root, className)}>
        {code && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
            <Typography variant="body2">
              Code:
            </Typography>
            <Typography variant="body2" color="error">
              {code}
            </Typography>
          </Box>
        )}
        {message && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
            <Typography variant="body2">
              Message:
            </Typography>
            <Typography variant="body2" color="error">
              {message}
            </Typography>
          </Box>
        )}
        {data && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
            <Typography variant="body2">
              Data:
            </Typography>
            <Typography variant="body2" color="error">
              <JsonPretty src={data} />
            </Typography>
          </Box>
        )}
        {trace && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
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
          </Box>
        )}
        {stack && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
            <Typography variant="body2">
              Stack:
            </Typography>
            <Typography component="div" variant="body2" color="error">
              {stack.split('\n').map((tr, i) => (
                <div key={i}>
                  <span>
                    {tr}
                  </span>
                </div>
              ))}
            </Typography>
          </Box>
        )}
        {!!Object.keys(other).length && (
          <Box mb={1} className={clsx(itemClassName, 'centered col')}>
            <Typography variant="body2">
              Other:
            </Typography>
            <Typography variant="body2" color="error">
              <JsonPretty src={other} />
            </Typography>
          </Box>
        )}
      </Box>



















      {/* <Grid className={clsx(classes.root, className)} container spacing={2}>
        <Grid className={itemClassName} item xs={12} />
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
            <Typography component="div" variant="body2" color="error">
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
      </Grid> */}
    </>
  );
}