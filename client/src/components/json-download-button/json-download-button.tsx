import { Button } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, { useCallback } from 'react';
import { pretty } from '../../helpers/pretty.helper';

interface IJsonDownloadButton {
  name: string;
  src: object;
  style?: CSSProperties;
  className?: string;
}

export function JsonDownloadButton(props: IJsonDownloadButton) {
  const { name, src, style, className } = props;

  const handleClick = useCallback(() => {
    // https://stackoverflow.com/questions/51215642/converting-object-into-json-and-downloading-as-a-json-file-in-react
    const filename = `${name.toLowerCase().trim().replace(/\s/g, '-')}.json`;
    const contentType = 'application/json;charset=utf-8;';

    if ((typeof window !== 'undefined') && window?.navigator?.msSaveOrOpenBlob) {
      const blob: Blob = new Blob([decodeURIComponent(encodeURI(pretty(src)))], { type: contentType });
      window.navigator.msSaveOrOpenBlob(blob, `${name}.json`);
    } else {
      const a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(pretty(src));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [name, src]);

  return (
    <Button style={style} className={className} onClick={handleClick}>
      <GetAppIcon />
    </Button>
  )
}