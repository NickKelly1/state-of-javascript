import {
  AppBar,
  Button,
  colors,
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
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import clsx from 'clsx';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useContext } from "react";
import { ApiContext } from "../../contexts/api.context";
import { useMutation, useQuery } from "react-query";

interface ITopBarProps {
  //
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logout: {
    cursor: "pointer",
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
}));

export function TopBar(props: ITopBarProps) {
  const { api, me } = useContext(ApiContext);
  const classes = useStyles();

  const router = useRouter();
  const [logout, logoutResult] = useMutation(async () => {
    await api.credentials.signOut();
    router.push('/'); 
  });

  return (
    <div className={classes.container}>
      <div>
        <Typography component="h1" variant="h6">
          The State of JavaScript
        </Typography>
      </div>
      <nav className={classes.nav}>
        <List className={classes.navList}>
          {me && (
            <ListItem className={classes.navItem}>
              <MUILink onClick={() => logout()} className={clsx(classes.navItem, classes.logout)} color="inherit">
                Logout
              </MUILink>
            </ListItem>
          )}
          {!me && (
            <>
              <ListItem className={classes.navItem}>
                <NextLink href="/register" passHref>
                  <MUILink className={classes.navItem} color="inherit">
                    Register
                  </MUILink>
                </NextLink>
              </ListItem>
              <ListItem className={classes.navItem}>
                <NextLink href="/login" passHref>
                  <MUILink className={classes.navItem} color="inherit">
                    Login
                  </MUILink>
                </NextLink>
              </ListItem>
            </>
          )}
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
  );
}