import React, { ComponentType, ReactElement, ReactNode } from "react";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { ApiConnector } from "../../backend-api/api.connector";
import { ApiException } from "../../backend-api/api.exception";
import { ApiContext, IApiContext, useApiContext } from "../../components-contexts/api.context";
import { OrFn } from "../../types/or-fn.type";
import { ist } from "../../helpers/ist.helper";
import { Box, CircularProgress, IconButton } from "@material-ui/core";
import { nodeify } from "../../helpers/nodeify.helper";
import { useDialog } from "../../hooks/use-dialog.hook";
import { JsonDialog } from "../../components/debug-json-dialog/json-dialog";

type IWithApiProvidedProps = IApiContext;

/**
 * Provide a fully loaded api instance to the component
 *
 * If the API hasn't finished loading, show them a loading spinner
 *
 * @param Component
 * @param arg
 */
export function WithApi<P>(
  Component: ComponentType<P & IWithApiProvidedProps>,
  // arg?: {
  //   whenLoading?: ReactNode;
  //   whenError?: ReactNode | ((exception: ApiException) => ReactNode);
  // },
): ComponentType<P> {
  // const { whenLoading, whenError, } = arg ?? {};

  const DoWithApi: React.FC<P> = (props: P): ReactElement => {
    const apiCtx = useApiContext();
    // const errorDebugDialog = useDialog();

    return (
      <>
        <Component {...props as P} {...apiCtx as IWithApiProvidedProps} />
      </> 
    );

    // return (
    //   <>
    //     {/* debug dialogue */}
    //     <DebugJsonDialog dialog={errorDebugDialog} title={`Error: ${apiCtx.error?.name ?? '?'}`} data={apiCtx.error} />

    //     {/* when success */}
    //     {apiCtx.value
    //       // success
    //       ? (
    //         <>
    //           <Component {...props as P} {...apiCtx.value as IWithApiProvidedProps} />
    //         </>
    //       )

    //       // loading
    //       : apiCtx.isLoading
    //       ? (
    //         <>
    //           {whenLoading
    //             ? nodeify(whenLoading)
    //             : <Box className="centered"><CircularProgress /></Box>}
    //         </>
    //       )

    //       // error
    //       : apiCtx.error
    //       ? (
    //         <>
    //           {ist.fn(whenError)
    //             ? nodeify(whenError(apiCtx.error))
    //             : ist.defined(whenError)
    //             ? nodeify(whenError)
    //             : (
    //               <Box className="centered">
    //                 <IconButton size="small" onClick={errorDebugDialog.doToggle}>
    //                   <ErrorOutlineIcon />
    //                 </IconButton>
    //               </Box>
    //             )}
    //         </>
    //       )

    //       : 'something went wrong...'
    //     }
    //   </>
    // );
  }

  return DoWithApi;
}