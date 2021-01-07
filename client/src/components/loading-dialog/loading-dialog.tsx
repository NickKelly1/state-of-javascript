import { CircularProgress, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import clsx from 'clsx';
import Box from "@material-ui/core/Box/Box";
import React from "react";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";

interface ILoadingDialogProps extends IWithDialogueProps {
  title: string;
}

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(3),
    overflow: 'hidden',
  },
}));

export const LoadingDialog = WithDialogue<ILoadingDialogProps>({
  // fullWidth: true,
  // style: {
  //   minHeight: '20rem',
  //   minWidth: '50rem',
  //   overflow: 'hidden',
  // },
})(props => {
  const { dialog, title } = props;

  const classes = useStyles();

  return (
    <>
      {/* {title && (
        <DialogTitle>
          {title}
        </DialogTitle>
      )} */}
      {/* <DialogContent dividers> */}
      <DialogContent className="centered">
        <Box className={clsx('centered', classes.box)}>
          <CircularProgress color="primary" size="5rem" />
        </Box>
      </DialogContent>
    </>
  )
});
