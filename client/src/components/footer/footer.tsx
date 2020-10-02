import { AppBar, Button, colors, Container, IconButton, makeStyles, Paper, Toolbar, Typography } from "@material-ui/core";
import React from "react";

interface IFooterProps {
  //
}

const useStyles = makeStyles((theme) => ({
}));

export function Footer(props: IFooterProps) {
  const classes = useStyles();

  return (
    <footer>
      <Typography variant="h6">
        {/* The State of JavaScript */}
      </Typography>
    </footer>
  );
}