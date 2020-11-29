import { DialogTitle, DialogContent, Grid, Box, Button, DialogActions } from "@material-ui/core";
import React from "react";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { JsonCopyButton } from "../json-copy-button/json-copy-button";
import { JsonDownloadButton } from "../json-download-button/json-download-button";
import { JsonPretty } from "../json-pretty/json-pretty";

export interface IDebugJsonDialogProps extends IWithDialogueProps {
  title: string;
  data: any;
}

export const DebugJsonDialog = WithDialogue<IDebugJsonDialogProps>({ fullWidth: true })((props) => {
  const { title, data, dialog, } = props;
  return (
    <>
      <DialogTitle>
        <span>
          {title}
        </span>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <JsonPretty src={data} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.doClose} color="primary">
          Close
        </Button>
        <JsonCopyButton data={data} />
        <JsonDownloadButton name={`${title}-data`} src={data} />
      </DialogActions>
    </>
  );
})