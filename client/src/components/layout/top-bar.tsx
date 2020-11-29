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
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";

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
    await api.logout();
    // router.push('/'); 
  });

  const handleLogout = useCallback(() => doLogout(), [doLogout]);
  const cogMenu = useMenu();
  const loginDialog = useDialog();
  const registerDialog = useDialog();

  const handleLoginClicked = useCallback(async () => {
    // try to refresh...
    try {
      // try to refresh
      await api.refresh();
    } catch (error) {
      // unable to refresh (probably no creds in cookies) -> open a login dialog
      loginDialog.doOpen();
      cogMenu.doClose();
    }
  }, [loginDialog, cogMenu, api]);

  const debugDialog = useDialog()

  return (
    <>
      <DebugJsonDialog title="Me" dialog={debugDialog} data={me} />
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
          {me.can.newsArticles.show && (
            <ListItem><NextLink href="/news" passHref><MUILink color="inherit">News</MUILink></NextLink></ListItem>
          )}
          {me.can.roles.show && (
            <ListItem><NextLink href="/roles" passHref><MUILink color="inherit">Roles</MUILink></NextLink></ListItem>
          )}
          {me.can.users.show && (
            <ListItem><NextLink href="/users" passHref><MUILink color="inherit">Users</MUILink></NextLink></ListItem>
          )}
          {me.can.integrations.show && (
            <ListItem><NextLink href="/admin/integrations" passHref><MUILink color="inherit">Integrations</MUILink></NextLink></ListItem>
          )}
        </List>
        <List component="nav" className="d-flex">
          {!me.isAuthenticated && me.can.users.register && (
            <ListItem color="primary">
              {/* <ListItemIcon><PersonAddIcon /></ListItemIcon> */}
              <Button onClick={flsx(registerDialog.doOpen, cogMenu.doClose)} className="text-transform-none">
                <ListItemText primary="register" />
              </Button>
            </ListItem>
          )}
          {!me.isAuthenticated && me.can.users.login && (
            <ListItem>
              {/* <ListItemIcon><AccountCircleIcon /></ListItemIcon> */}
              <Button onClick={handleLoginClicked} className="text-transform-none">
                <ListItemText primary="login" />
              </Button>
            </ListItem>
          )}
          {me.isAuthenticated && (
            // <ListItem>
              <ListItem className="text-transform-none">
                {/* {debugMode.isOn && ( */}
                  {/* <Button color="primary" > */}
                    {/* <ListItemIcon><AccountCircleIcon /></ListItemIcon> */}
                    <ListItemIcon>
                      <IconButton onClick={debugDialog.doToggle} color={debugMode.isOn ? 'primary' : 'inherit'} disabled={!debugMode.isOn}>
                        <AccountCircleIcon />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText primary={me.name} />
                  {/* </Button> */}
                {/* // )} */}
                {/* {!debugMode.isOn && (
                  <>
                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary={me.name} />
                  </>
                )} */}
              </ListItem>
            // </ListItem>
          )}
          {me.isAuthenticated && (
            <ListItem>
              {/* <ListItemIcon></ListItemIcon> */}
              <Button onClick={flsx(handleLogout, cogMenu.doClose)} startIcon={<ExitToAppIcon />} className="text-transform-none">
                <ListItemText primary="logout" />
              </Button>
            </ListItem>
          )}
          {/* <WhenDebugMode>
            <ListItem>
              <IconButton color="primary" onClick={debugDialog.doToggle}>
                <BugReportIcon />
              </IconButton>
            </ListItem>
          </WhenDebugMode> */}
          <ListItem onClick={debugMode.toggle}>
            {/* <ListItemIcon> */}
              <IconButton color={debugMode.isOn ? 'primary' : 'inherit'}>
                <BugReportIcon />
              </IconButton>
            {/* </ListItemIcon> */}
          </ListItem>
          {/* todo position menu UNDER button */}
          {/* <ListItem>
            <Menu
              anchorEl={cogMenu.anchor}
              keepMounted
              open={cogMenu.isOpen}
              onClose={cogMenu.doClose}
            >
              {!me && (
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
              )}
              <MenuItem onClick={flsx(debugMode.toggle, cogMenu.doClose)}>
                <ListItemIcon><BugReportIcon color={debugMode.isOn ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="debug mode" />
              </MenuItem>
            </Menu>
            <Button onClick={cogMenu.doOpen}>
              <SettingsIcon />
            </Button>
          </ListItem> */}
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