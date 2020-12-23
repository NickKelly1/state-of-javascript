import { Button, FormHelperText } from "@material-ui/core";
import clsx from 'clsx';
import React, { ReactNode, useMemo } from "react";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { hidex, hidey } from "../../helpers/hidden.helper";
import { nodeify } from "../../helpers/nodeify.helper";
import { useDialog } from "../../hooks/use-dialog.hook";
import { OrNullable } from "../../types/or-nullable.type";
import { JsonDialog } from "../debug-json-dialog/json-dialog";
import { ExceptionDetail } from "../exception/exception-detail";

interface IFormExceptionProps {
  message?: OrNullable<ReactNode>;
  className?: OrNullable<string>;
  exception: OrNullable<IApiException>;
}

export function ExceptionButton(props: IFormExceptionProps): JSX.Element {
  const { exception, className, message } = props;

  const dialog = useDialog();

  const detail = useMemo(() => <ExceptionDetail centered className="centered" exception={exception} />, [exception]);

  return (
    <>
      <JsonDialog render={detail} title={exception?.name ?? ''} data={exception} dialog={dialog} />
      <Button className={clsx('text-transform-none', className, hidex(!exception))} onClick={dialog.doToggle} color="secondary">
        <FormHelperText className="centered" error>
          {message && nodeify(message)}
          {!message && exception?.message}
        </FormHelperText>
      </Button>
    </>
  );
}