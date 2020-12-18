import { DialogTitle, DialogContent, Grid, Button, DialogActions } from "@material-ui/core";
import React from "react";
import { WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { OrNullable } from "../../types/or-nullable.type";
import { JsonCopyButton } from "../json-copy-button/json-copy-button";
import { JsonDownloadButton } from "../json-download-button/json-download-button";
import { JsonPretty } from "../json-pretty/json-pretty";

export interface IJsonDialogProps {
  title: string;
  data: any;
  render?: OrNullable<INodeable>;
}

export const JsonDialog = WithDialogue<IJsonDialogProps>({ fullWidth: true })((props) => {
  const { title, data, dialog, render } = props;
  return (
    <>
      <DialogTitle>
        <span>
          {title}
        </span>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid className="centered" item xs={12}>
            {render && nodeify(render)}
            {!render && <JsonPretty src={data} />}
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