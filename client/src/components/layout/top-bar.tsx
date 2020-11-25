import {
  AppBar,
  Box,
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
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import BugReportIcon from '@material-ui/icons/BugReport';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import clsx from 'clsx';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useCallback, useContext, useState } from "react";
import { ApiContext } from "../../components-contexts/api.context";
import { useMutation } from "react-query";
import { DebugModeContext } from "../../components-contexts/debug-mode.context";
import { LoginFormDialog } from "../login/login.form.dialog";
import { RegisterFormDialog } from "../register/register.form.dialog";
import { useDialog } from "../../hooks/use-dialog.hook";
import { useMenu } from "../../hooks/use-menu.hook";
import { flsx } from "../../helpers/flsx.helper";

interface ITopBarProps {
  //
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  logout: {
    cursor: "pointer",
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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
  const [doLogout, logoutResult] = useMutation(async () => {
    await api.credentials.signOut();
    // router.push('/'); 
  });

  const handleLogout = useCallback(() => doLogout(), [doLogout]);
  const cogMenu = useMenu();
  const loginDialog = useDialog();
  const registerDialog = useDialog();

  return (
    <>
      <LoginFormDialog dialog={loginDialog} onSuccess={loginDialog.doClose} />
      <RegisterFormDialog dialog={registerDialog} onSuccess={registerDialog.doClose} />
      <Box className={classes.root}>
        <List component="nav" className="d-flex">
          <ListItem>
            <NextLink href="/" passHref>
              <MUILink underline="none" color="inherit">
                <Typography noWrap component="h1" variant="h3">
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <img style={{ height: '1em' }} src="/favicon.svg" />
                    &nbsp;
                    <span>
                      Nick Kelly
                    </span>
                  </Box>
                </Typography>
              </MUILink>
            </NextLink>
          </ListItem>
          <ListItem><NextLink href="/hire-me" passHref><MUILink color="inherit">Hire me</MUILink></NextLink></ListItem>
          <ListItem><NextLink href="/blog" passHref><MUILink color="inherit">Blog</MUILink></NextLink></ListItem>
          <ListItem><NextLink href="/news" passHref><MUILink color="inherit">News</MUILink></NextLink></ListItem>
          <ListItem><NextLink href="/roles" passHref><MUILink color="inherit">Roles</MUILink></NextLink></ListItem>
          <ListItem><NextLink href="/users" passHref><MUILink color="inherit">Users</MUILink></NextLink></ListItem>
          <ListItem><NextLink href="/admin/integrations" passHref><MUILink color="inherit">Integrations</MUILink></NextLink></ListItem>
        </List>
        <List component="nav" className="d-flex">
          {!me && (
            <ListItem color="primary" onClick={flsx(registerDialog.doOpen, cogMenu.doClose)}>
              {/* <ListItemIcon><PersonAddIcon /></ListItemIcon> */}
              <Button className="text-transform-none"><ListItemText primary="register" /></Button>
            </ListItem>
          )}
          {!me && (
            <ListItem onClick={flsx(loginDialog.doOpen, cogMenu.doClose) }>
              {/* <ListItemIcon><AccountCircleIcon /></ListItemIcon> */}
              <Button className="text-transform-none"><ListItemText primary="login" /></Button>
            </ListItem>
          )}
          {me && (
            <ListItem>
              <ListItem className="text-transform-none">
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary={me.name} />
              </ListItem>
            </ListItem>
          )}
          {me && (
            <ListItem onClick={flsx(handleLogout, cogMenu.doClose)}>
              {/* <ListItemIcon></ListItemIcon> */}
              <Button startIcon={<ExitToAppIcon />} className="text-transform-none"><ListItemText primary="logout" /></Button>
            </ListItem>
          )}
          <ListItem>
            {/* todo position menu UNDER button */}
            <Menu
              anchorEl={cogMenu.anchor}
              keepMounted
              open={cogMenu.isOpen}
              onClose={cogMenu.doClose}
            >
              {/* {!me && (
                <MenuItem color="primary" onClick={flsx(registerDialog.doOpen, cogMenu.doClose)}>
                  <ListItemIcon><PersonAddIcon /></ListItemIcon>
                  <ListItemText primary="register" />
                </MenuItem>
              )}
              {!me && (
                <MenuItem onClick={flsx(loginDialog.doOpen, cogMenu.doClose) }>
                  <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="login" />
                </MenuItem>
              )}
              {me && (
                <MenuItem onClick={flsx(handleLogout, cogMenu.doClose)}>
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="logout" />
                </MenuItem>
              )} */}
              <MenuItem onClick={flsx(debugMode.toggle, cogMenu.doClose)}>
                <ListItemIcon><BugReportIcon color={debugMode.isOn ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="debug mode" />
              </MenuItem>
            </Menu>
            <Button onClick={cogMenu.doOpen}>
              <SettingsIcon />
            </Button>
          </ListItem>
          <ListItem>
            <MUILink
              className={clsx('centered', classes.icon)}
              href="https://github.com/NickKelly1/state-of-js"
              color="inherit">
              <GitHubIcon />
            </MUILink>
          </ListItem>
        </List>
      </Box>
    </>
  );
}