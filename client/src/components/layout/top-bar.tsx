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
// import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircleOutlined';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import clsx from 'clsx';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useCallback, useContext, useMemo, useState } from "react";
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
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { apiMeFns } from "../../backend-api/api.me";

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



export const TopBar = WithApi<ITopBarProps>((props) => {
  const { api, me } = props;
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

  const meDebugDialog = useDialog()
  const meDebugData = useMemo(() => apiMeFns.toJSON(me), [me]);

  return (
    <>
      <DebugJsonDialog title="Me" dialog={meDebugDialog} data={meDebugData} />
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
          {me.can?.newsArticles.show && (
            <ListItem><NextLink href="/news" passHref><MUILink color="inherit">News</MUILink></NextLink></ListItem>
          )}
          {me.can?.roles.show && (
            <ListItem><NextLink href="/roles" passHref><MUILink color="inherit">Roles</MUILink></NextLink></ListItem>
          )}
          {me.can?.users.show && (
            <ListItem><NextLink href="/users" passHref><MUILink color="inherit">Users</MUILink></NextLink></ListItem>
          )}
          {me.can?.integrations.show && (
            <ListItem><NextLink href="/admin/integrations" passHref><MUILink color="inherit">Integrations</MUILink></NextLink></ListItem>
          )}
        </List>
        <List component="nav" className="d-flex">
          {me.user && (
            <ListItem className="text-transform-none">
              <ListItemText primary={me.user.name} />
            </ListItem>
          )}
          <ListItem className="text-transform-none">
            <IconButton onClick={meDebugDialog.doToggle} color="primary">
              <AccountCircleIcon />
            </IconButton>
          </ListItem>
          {(me.isAuthenticated) && (
            <ListItem>
              <Button onClick={flsx(handleLogout, cogMenu.doClose)} startIcon={<ExitToAppIcon />} className="text-transform-none">
                <ListItemText primary="logout" />
              </Button>
            </ListItem>
          )}
          {/* register */}
          {(!me.isAuthenticated && me.can?.users.register) && (
            <ListItem color="primary">
              <Button onClick={flsx(registerDialog.doOpen, cogMenu.doClose)} className="text-transform-none">
                <ListItemText primary="register" />
              </Button>
            </ListItem>
          )}
          {/* login */}
          {(!me.isAuthenticated && me.can?.users.login) && (
            <ListItem>
              <Button onClick={handleLoginClicked} className="text-transform-none">
                <ListItemText primary="login" />
              </Button>
            </ListItem>
          )}
          <ListItem onClick={debugMode.toggle}>
            <IconButton color={debugMode.isOn ? 'primary' : 'inherit'}>
              <BugReportIcon />
            </IconButton>
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
});