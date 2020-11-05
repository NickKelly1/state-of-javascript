import { gql } from 'graphql-request';
import React, { useContext } from 'react';
import { ApiConnector } from '../../backend-api/api.connector';
import { ApiContext } from '../../contexts/api.context';
import { DebugModeContext } from '../../contexts/debug-mode.context';

const npmsDashboardSortFormQuery = gql`
query NpmsDashbortSortForm(
  $dashboardOffset:Int
  $dashboardLimit:Int
){
  npmsDashboards(
    query:{
      limit:$dashboardLimit
      offset:$dashboardOffset
    }
  ){
    can{
      show
      create
    }
    pagination{
      limit
      offset
      total
      page_number
      pages
      more
    }
    nodes{
      cursor
      can{
        show
        update
        delete
      }
      data{
        id
        name
        created_at
        updated_at
        deleted_at
      }
    }
  }
}
`
interface INpmsDashboardSortFormProps {
  onSuccess?: () => any;
}

const defaultQueryVars = {
  //
}

export function NpmsDashboardSortForm(props: INpmsDashboardSortFormProps) {
  const { api, me } = useContext(ApiContext);
  const debugMode = useContext(DebugModeContext);

  // TODO... Sort dashboards...
  // const q = useQuery(() => {
  //   api.connector.graphql(npmsDashboardSortFormQuery, {});
  // })

  return (
    <div>
      todo
    </div>
  );
  //
}