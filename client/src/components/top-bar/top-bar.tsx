import {
  AppBar,
  Button,
  colors,
  IconButton,
  Link as MUILink,
  makeStyles,
  Paper,
  Toolbar,
  Typography } from "@material-ui/core";
import clsx from 'clsx';
import GitHubIcon from '@material-ui/icons/GitHub';

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
  nav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '100%',
    width: '100%',
  },
}));

export function TopBar(props: ITopBarProps) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography component="h1" variant="h6">
          The State of JavaScript
        </Typography>
      </div>
      <nav className={classes.nav}>
        <MUILink className={clsx('centered', classes.icon)} href="https://github.com/NickKelly1/state-of-js" color="inherit">
          <GitHubIcon />
        </MUILink>
      </nav>
    </div>
  );
}