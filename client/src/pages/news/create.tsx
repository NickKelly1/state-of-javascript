import { Box, Button, Grid, Input, InputLabel, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import cookies from 'next-cookies';
import { gql } from "graphql-request";
import React, { FormEventHandler, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { ApiContext } from "../../contexts/api.context";
import { AuthLoginMutation, AuthSignupMutation, CreateNewsArticlePageQuery, CreateNewsArticlePageQueryVariables } from "../../generated/graphql";
import { pretty } from "../../helpers/pretty.helper";
import { serverSidePropsHandler } from "../../helpers/server-side-props-handler.helper";

interface ICreateNewsPageProps {
  //
}


const pageQuery = gql`
query CreateNewsArticlePage{
  newsArticles{
    meta{
      limit
      offset
      total
      page_number
      pages
      more
    }
    edges{
      node{
        id
        title
        teaser
        body
        created_at
        updated_at
        deleted_at
      }
    }
  }
}
`

const useStyles = makeStyles((theme) => ({
  form: {
    //
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function CreateNewsPage(props: ICreateNewsPageProps) {
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();

  const { data, isLoading, error } = useQuery('dur', async () => {
    const result = await api
      .connector
      .graphql<CreateNewsArticlePageQuery, CreateNewsArticlePageQueryVariables>(pageQuery);
    return result;
  }, {});

  const [signup, signupResult] = useMutation(async (arg: { name: string; password: string; } ): Promise<IAuthenticationRo> => {
    const { name, password } = arg;
    const result = await api.credentials.signUp({ name, password });
    return result;
  });

  const [login, loginResult] = useMutation(async (arg: { name: string; password: string; }): Promise<IAuthenticationRo> => {
    const { name, password } = arg;
    const result = await api.credentials.signIn({ name, password });
    return result;
  });

  const [signupData, setSignupData] = useState({ name: '', password: '' });
  const [loginData, setLoginData] = useState({ name: '', password: '' });

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            me
          </Typography>
          <pre>
            {pretty(me)}
          </pre>
        </Grid>
        {/* signup */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper className={classes.paper}>
            <Grid container spacing={2} className={classes.form}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Sign up
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form onSubmit={(evt) => {
                  evt.preventDefault();
                  signup(signupData);
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <InputLabel htmlFor="signup_name">name</InputLabel>
                      <Input
                        id="signup_name"
                        value={signupData.name}
                        onChange={(evt) => {
                          const value = evt.target.value;
                          setSignupData((prev) => ({ ...prev, name: value }))
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <InputLabel htmlFor="signup_password">password</InputLabel>
                      <Input
                        id="signup_password"
                        type="password"
                        value={signupData.password}
                        onChange={(evt) => {
                          const value = evt.target.value;
                          setSignupData((prev) => ({ ...prev, password: value }))
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button type="submit">
                        Sumbit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={12}>
                <pre>
                  {pretty(signupResult)}
                </pre>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* login */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper className={classes.paper}>
            <Grid container spacing={2} className={classes.form}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Log in
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form onSubmit={(evt) => {
                  evt.preventDefault();
                  login(loginData);
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <InputLabel htmlFor="login_name">name</InputLabel>
                      <Input
                        id="login_name"
                        value={loginData.name}
                        onChange={(evt) => {
                          const value = evt.target.value;
                          setLoginData((prev) => ({ ...prev, name: value }));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <InputLabel htmlFor="login_password">password</InputLabel>
                      <Input
                        id="login_password"
                        type="password"
                        value={loginData.password}
                        onChange={(evt) => {
                          const value = evt.target.value;
                          setLoginData((prev) => ({ ...prev, password: value }))
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button type="submit">
                        Sumbit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={12}>
                <pre>
                  {pretty(loginResult)}
                </pre>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* <pre>
        {pretty(me)}
      </pre>
      <h1>
        error
      </h1>
      <pre>
        {pretty({ error })}
      </pre>
      <br />

      <h1>
        loading
      </h1>
      <pre>
        {pretty({ isLoading })}
      </pre>
      <br />

      <h1>
        data
      </h1>
      <pre>
        {pretty({ data })}
      </pre>
      <br /> */}

    </div>
  );
}

export const getServerSideProps = serverSidePropsHandler<ICreateNewsPageProps>(async ({ ctx, cms, npmsApi, api, }) => {


  return {
    props: {
      //
    },
  }
  // const props: ICreateNewsPageProps = {
  //   users,
  //   roles,
  //   userRoles,
  //   rolePermissions,
  //   permissions,
  // };

  // return {
  //   props,
  //   // revalidate: false,
  // };
});

export default CreateNewsPage;