import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { ApiContext } from "../../contexts/api.context";
import { RoleDetailDataQuery, RoleDetailDataQueryVariables } from "../../generated/graphql";
import { ist } from "../../helpers/ist.helper";
import { Id } from "../../types/id.type";
import { DebugException } from "../debug-exception/debug-exception";
import { NotFound } from "../not-found/not-found";

const RoleDetailDataQueryName = (id: Id) => `RoleDetailDataQuery_${id}`;
const roleDetailDataQuery = gql`
query RoleDetailData(
  $id:Float!
){
  roles(
    query:{
      filter:{
        attr:{
          id:{
            eq:$id
          }
        }
      }
    }
  ){
    nodes{
      can{
        show
        update
        delete
        createRolePermission
      }
      data{
        id
        name
			}
    }
  }
}
`;

interface IRoleDetailProps {
  role_id: Id;
}

export function RoleDetail(props: IRoleDetailProps) {
  const { role_id } = props;
  const { me, api } = useContext(ApiContext);

  const [vars, setVars] = useState<RoleDetailDataQueryVariables>({ id: Number(role_id), });
  const queryCb = useCallback(async (): Promise<RoleDetailDataQuery> => {
    const result = await api
      .connector
      .graphql<RoleDetailDataQuery, RoleDetailDataQueryVariables>(
        roleDetailDataQuery,
        vars,
      )
      .catch(rethrow(normaliseApiException));
    return result;
  }, [api, me, vars]);
  const { data, error, isLoading, } = useQuery<RoleDetailDataQuery, ApiException>(
    RoleDetailDataQueryName(role_id),
    queryCb,
  );

  const roles = useMemo(() => data?.roles.nodes.filter(ist.notNullable), [data?.roles]);

  return (
    <Grid container spacing={2}>
      {isLoading && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {error && (
        <Grid item xs={12}>
          <DebugException always exception={error} />
        </Grid>
      )}
      {roles?.length === 0 && (
        <Grid item xs={12}>
          <NotFound message={`Role "${role_id}" not found"`} />
        </Grid>
      )}
      {roles?.length === 1 && (
        <Grid item xs={12}>
          <RoleDetailContent
            role={roles[0]}
          />
        </Grid>
      )}
    </Grid>
  );
}

interface IRoleDetailContentProps {
  role: NonNullable<RoleDetailDataQuery['roles']['nodes'][0]>
}

function RoleDetailContent(props: IRoleDetailContentProps) {
  const { role } = props;
  //
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1">
          {`${role.data.name}`}
        </Typography>
      </Grid>
    </Grid>
  );
}