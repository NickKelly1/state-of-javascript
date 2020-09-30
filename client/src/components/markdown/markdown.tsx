import { makeStyles, styled, createStyles } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface IMarkdownProps {
  children: string;
}


const useStyles = makeStyles((theme) => ({
  root: {
    '& a': {
      color: theme.palette.primary.main,
    },
  },
}));


export function Markdown(props: IMarkdownProps) {
  const { children } = props;
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <ReactMarkdown>
        {children}
      </ReactMarkdown>
    </span>
  )
}