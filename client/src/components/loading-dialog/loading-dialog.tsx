import { CircularProgress, DialogContent, DialogTitle } from "@material-ui/core";
import Box from "@material-ui/core/Box/Box";
import React from "react";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";

interface ILoadingDialogProps extends IWithDialogueProps {
  title: string;
}
export const LoadingDialog = WithDialogue<ILoadingDialogProps>({ fullWidth: true })(props => {
  const { dialog, title } = props;
  return (
    <>
      {title && (
        <DialogTitle>
          {title}
        </DialogTitle>
      )}
      <DialogContent dividers>
        <Box className="centered">
          <CircularProgress />
        </Box>
      </DialogContent>
    </>
  )
});
