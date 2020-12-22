import React, { MouseEventHandler, useCallback, useRef } from 'react';
import { IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import { useSnackbar } from 'notistack';
import { OrNullable } from '../../types/or-nullable.type';

export interface IJsonCopyButtonProps {
  data: any;
}
export function JsonCopyButton(props: IJsonCopyButtonProps) {
  const { data } = props;
  const { enqueueSnackbar } = useSnackbar();

  const ref = useRef<OrNullable<HTMLButtonElement>>();

  const handleCopyClicked: MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    try {
      if (!ref.current) throw new Error('Something went wrong');
      // debugger;
      const textArea = document.createElement('textarea');

      // https://stackoverflow.com/questions/60170474/cant-implement-copy-to-clipboard-function
      // @note: I'm attaching to button instead of body in-case body isn't focusable (maybe we're in a modal)

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a
      // flash, so some of these are just precautions. However in
      // Internet Explorer the element is visible whilst the popup
      // box asking the user for permission for the web page to
      // copy to the clipboard.
      //


      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = '0';

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';


      const str = JSON.stringify(data || {}, null, 2);
      textArea.value = str;
      ref.current.appendChild(textArea);
      textArea.focus();
      textArea.select();
      // is this required for mobile?
      // inp.setSelectionRange(0, 999999);
      document.execCommand('copy');
      ref.current.removeChild(textArea);
      window.getSelection()?.removeAllRanges();
      enqueueSnackbar(`Copied to clipboard: ${str.substring(0, 10)}...`, { variant: 'success' }, );
    } catch (error) {
      enqueueSnackbar(`Failed to Copy to Clipboard: ${error.message}`, { variant: 'error' }, );
    }
  }, [enqueueSnackbar, data]);

  return (
    <IconButton ref={inp => ref.current = inp} onClick={handleCopyClicked} color="primary">
      <FileCopyIcon />
    </IconButton>
  );
}