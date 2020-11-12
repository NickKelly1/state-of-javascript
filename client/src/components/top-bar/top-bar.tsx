import {
  AppBar,
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link as MUILink,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import BugReportIcon from '@material-ui/icons/BugReport';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import clsx from 'clsx';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useCallback, useContext, useState } from "react";
import { ApiContext } from "../../contexts/api.context";
import { useMutation } from "react-query";
import { DebugModeContext } from "../../contexts/debug-mode.context";
import { LoginFormDialog } from "../forms/login.form.dialog";
import { RegisterFormDialog } from "../forms/register.form.dialog";
import { useDialog } from "../../hooks/use-dialog.hook";

interface ITopBarProps {
  //
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    cursor: "pointer",
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  nav: {
    //
  },
  navList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    //
  },
  icon: {
    height: '100%',
    width: '100%',
  },
  middle: {
    display: 'flex',
    flexDirection: 'row',
  }
}));

export function TopBar(props: ITopBarProps) {
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();

  const debugMode = useContext(DebugModeContext);

  const router = useRouter();
  const [logout, logoutResult] = useMutation(async () => {
    await api.credentials.signOut();
    // router.push('/'); 
  });

  const loginDialog = useDialog();
  const registerDialog = useDialog();

  return (
    <>
      <LoginFormDialog dialog={loginDialog} onSuccess={loginDialog.doClose} />
      <RegisterFormDialog dialog={registerDialog} onSuccess={registerDialog.doClose} />
      <div className={classes.root}>
        <div>
          <Typography component="h1" variant="h3">
            <ListItem>
              <NextLink href="/" passHref>
                <MUILink className={classes.center} color="inherit">
                  <img style={{ height: '1em' }} src="/favicon.svg" />
                  &nbsp;
                  <span>
                    The State of JavaScript
                  </span>
                </MUILink>
              </NextLink>
            </ListItem>
          </Typography>
        </div>
        <nav className={classes.nav}>
          <List className={classes.navList}>
            <ListItem className={classes.navItem}>
              <NextLink href="/stats" passHref>
                <MUILink color="inherit">
                  Stats
                </MUILink>
              </NextLink>
            </ListItem>
            <ListItem className={classes.navItem}>
              <NextLink href="/resources" passHref>
                <MUILink color="inherit">
                  Resources
                </MUILink>
              </NextLink>
            </ListItem>
            <ListItem className={classes.navItem}>
              <NextLink href="/news" passHref>
                <MUILink color="inherit">
                  News
                </MUILink>
              </NextLink>
            </ListItem>
            <ListItem className={classes.navItem}>
              <NextLink href="/blog" passHref>
                <MUILink color="inherit">
                  Blog
                </MUILink>
              </NextLink>
            </ListItem>
            {me && (
              <ListItem className={classes.navItem}>
                <MUILink onClick={() => logout()} className={clsx(classes.navItem, classes.logout)} color="inherit">
                  {`(${me.name}) Logout`}
                </MUILink>
              </ListItem>
            )}
            {!me && (
              <>
                <ListItem className={classes.navItem}>
                  <Button color={registerDialog.isOpen ? 'primary' : 'inherit'} className="text-transform-none" onClick={registerDialog.doOpen}>
                    Register
                  </Button>
                </ListItem>
                <ListItem className={classes.navItem}>
                  <Button color={loginDialog.isOpen ? 'primary' : 'inherit'} className="text-transform-none" onClick={loginDialog.doOpen}>
                    Login
                  </Button>
                </ListItem>
              </>
            )}
            <ListItem className={classes.navItem}>
              <Button color={debugMode.isOn ? 'primary' : 'inherit'} onClick={debugMode.toggle}>
                <BugReportIcon />
              </Button>
            </ListItem>
            <ListItem className={classes.navItem}>
              <MUILink
                className={clsx('centered', classes.icon, classes.navItem)}
                href="https://github.com/NickKelly1/state-of-js"
                color="inherit">
                <GitHubIcon />
              </MUILink>
            </ListItem>
          </List>
        </nav>
      </div>
    </>
  );
}