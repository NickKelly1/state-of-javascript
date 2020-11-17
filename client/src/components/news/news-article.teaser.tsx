import React, { ReactNode, useContext, useMemo, } from "react";
import { Box, Button, Grid, Input, InputLabel, ListItem, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { formatRelative } from 'date-fns';
import { OrNull } from "../../types/or-null.type";
import { ApiContext } from "../../components-contexts/api.context";
import { Markdown } from "../markdown/markdown";

const useStyles = makeStyles((theme) => ({
  title: {
    //
  },
  buttons: {
    padding: theme.spacing(2),
    paddingLeft: '0',
    marginLeft: '0',
    display: 'flex',
    justifyContent: 'flex-start',
  },
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
      softDelete: boolean;
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

export function NewsArticleTeaser(props: INewsArticleTeaserProps) {
  const { node } = props;
  const { me } = useContext(ApiContext);
  const classes = useStyles();
  const created = useMemo(() => formatRelative(node.data.created_at, new Date()), [node.data.created_at]);

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title} variant="h2" component="h2">
        {node.data.title}
          {(node.can.update) && (
            <NextLink href={`/news/edit/${node.data.id}`} passHref>
              <Box component="span" ml={2}>
                <MUILink className="btn-link" color="inherit">
                  <Button color="primary" variant="outlined">
                    {'Edit'}
                  </Button>
                </MUILink>
              </Box>
            </NextLink>
          )}
          {(node.can.softDelete) && (
            <Box component="span" ml={2}>
              <Button color="secondary" variant="outlined">
                {'Soft Delete'}
              </Button>
            </Box>
          )}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {created}
      </Typography>
      <Markdown>
        {node.data.teaser}
      </Markdown>
      <div>
        <NextLink href={`/news/view/${node.data.id}`} passHref>
          <MUILink color="textSecondary">
            more...
          </MUILink>
        </NextLink>
      </div>
    </Paper>
  );
}