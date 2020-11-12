import { Dialog, DialogProps } from "@material-ui/core";
import React from "react";
import { ist } from "../../helpers/ist.helper";
import { IUseDialogReturn } from "../../hooks/use-dialog.hook";


export interface IWithDialogueProps {
  dialog: IUseDialogReturn;
}

export const WithDialogue =
  <P extends IWithDialogueProps>(dialogProps?: Partial<DialogProps> | ((props: P) => Partial<DialogProps>)) =>
  (Element: React.ComponentType<P>): React.ComponentType<P> =>
  (props: P): JSX.Element => {
  const { dialog } = props;
  const dProps = ist.fn(dialogProps) ? dialogProps(props) : dialogProps;
  return (
    <Dialog {...dProps} open={dialog.isOpen} onClose={dialog.doClose}>
      <Element {...props} />
    </Dialog>
  );
}

