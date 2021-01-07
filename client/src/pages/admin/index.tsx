import { Box, Grid } from "@material-ui/core";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import React from "react";


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  list: {
    paddingLeft: theme.spacing(2),
  },
  item: {
    //
  },
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminPageProps {
  //
}

interface ILinkItem {
  text: string;
  color: 'initial'
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'textPrimary'
      | 'textSecondary'
      | 'error';
  href: string;
}
interface ILinkList {
  text: string;
  items: ILinkItem[];
}
interface IPageLinks {
  lists: ILinkList[];
}
const page: IPageLinks = {
  lists: [
    {
      text: 'News Articles',
      items: [
        { text: 'Create', color: 'primary', href: '/admin/news/create', },
        { text: 'Show: Admin', color: 'primary', href: '/admin/news', },
        { text: 'Show: Public', color: 'primary', href: '/news', },
      ],
    },
    {
      text: 'Blog Posts',
      items: [
        { text: 'Create', color: 'primary', href: '/admin/posts/create', },
        { text: 'Show: Admin', color: 'primary', href: '/admin/posts', },
        { text: 'Show: Public', color: 'primary', href: '/posts', },
      ],
    },
    {
      text: 'Users',
      items: [
        { text: 'Show: Admin', color: 'primary', href: '/admin/users', },
      ],
    },
    {
      text: 'Roles',
      items: [
        { text: 'Show: Admin', color: 'primary', href: '/admin/roles', },
      ],
    },
    {
      text: 'Permissions',
      items: [
        //
      ],
    },
    {
      text: 'Integrations',
      items: [
        { text: 'Show: Admin', color: 'primary', href: '/admin/integrations', },
      ],
    },
    {
      text: 'Logs',
      items: [
        { text: 'Show: Admin', color: 'primary', href: '/admin/logs', },
      ],
    },
    {
      text: 'Jobs',
      items: [
        { text: 'Show: Admin', color: 'primary', href: '/admin/jobs', },
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminPage(props: IAdminPageProps): JSX.Element {
  // const {} = props;
  const classes = useStyles();

  // TODO: live server stats...
  // TODO: live socket connections...
  // TODO: live log stream...
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">
          Admin Panel
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            {page.lists.map((list, i) => (
              <Grid key={i} item xs={12} sm={6}>
                <Typography component="h2" variant="h2">
                  {list.text}
                </Typography>
                <ul className={classes.list}>
                  {list.items.map((item, j) => (
                    <li key={j} className={classes.item}>
                      <NextLink href={item.href} passHref>
                        <MUILink color={item.color}>
                          {item.text}
                        </MUILink>
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminPage;