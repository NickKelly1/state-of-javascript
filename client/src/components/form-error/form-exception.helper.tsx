import { Button, FormHelperText } from "@material-ui/core";
import clsx from 'clsx';
import { error } from "console";
import React from "react";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { useDialog } from "../../hooks/use-dialog.hook";
import { OrNullable } from "../../types/or-nullable.type";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";

interface IFormExceptionProps {
  className?: OrNullable<string>;
  exception: IApiException;
}

export function FormException(props: IFormExceptionProps) {
  const { exception, className } = props;

  const dialog = useDialog();

  return (
    <>
      <DebugJsonDialog title={exception.name} data={exception} dialog={dialog} />
      <Button className={clsx('text-transform-none', className)} onClick={dialog.doToggle} color="secondary">
        <FormHelperText className="centered" error>
          {exception.message}
        </FormHelperText>
      </Button>
    </>
  );
}