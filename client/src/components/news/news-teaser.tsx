import React, { ReactNode, useContext, useMemo, } from "react";
import { Box, Button, Grid, Input, InputLabel, ListItem, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { formatRelative } from 'date-fns';
import { OrNull } from "../../types/or-null.type";
import { ApiContext } from "../../contexts/api.context";
import { Markdown } from "../markdown/markdown";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));


export interface INewsArticleTeaserProps {
  node: {
    data: {
      id: number;
      title: string;
      teaser: string;
      author_id: number;
      created_at: Date;
      updated_at: Date;
      deleted_at: OrNull<Date>;
    },
    can: {
      show: boolean;
      update: boolean;
      delete: boolean;
    },
    relations: {
      author: OrNull<{
        data: {
          id: number;
          name: string
        },
      }>,
    }
  },
};

export function NewsTeaser(props: INewsArticleTeaserProps) {
  const { me } = useContext(ApiContext);
  const classes = useStyles();
  const created = useMemo(() => formatRelative(props.node.data.created_at, new Date()), [props.node.data.created_at]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2" component="h2">
        {props.node.data.title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {created}
      </Typography>
      <Markdown>
        {props.node.data.teaser}
      </Markdown>
    </Paper>
  );
}