import { Card, CardActionArea, CardContent, CircularProgress, Fab, List, ListItem, makeStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";
import { useUpdate } from "../../hooks/use-update.hook";
import { OrUndefined } from "../../types/or-undefined.type";
import { Icons } from "../icons/icons.const";

// export enum ImagePickerSelectionNode { None, Local, Id, }
// export type IImagePickerSelectionState =
//   | { mode: ImagePickerSelectionNode.None, local: undefined, image_id: undefined, }
//   | { mode: ImagePickerSelectionNode.Local, local: File, image_id: undefined, }
//   | { mode: ImagePickerSelectionNode.Id, local: undefined, image_id: number,  }

interface IImagePickerOnChange { (change: OrUndefined<File>): void; }
enum ImagePickerMode { None, Picked, }
interface IImagePickerStateNone { mode: ImagePickerMode.None; image: undefined; src: undefined; }
interface IImagePickerStatePicked { mode: ImagePickerMode.Picked; image: File; src: string; }
type IImagePickerState =
  | IImagePickerStateNone
  | IImagePickerStatePicked;
function reduceState(
  prev: OrUndefined<IImagePickerState>,
  payload: { image: OrUndefined<File> }
): IImagePickerState {
  const { image } = payload;
  if (image) {
    return {
      image,
      mode: ImagePickerMode.Picked,
      src: URL.createObjectURL(image),
    };
  }
  return {
    image: undefined,
    mode: ImagePickerMode.None,
    src: undefined,
  };
}


const useImagePickerStyles = makeStyles((theme) => ({
  root: {
    //
  },
  card: {
    width: '100%',
    paddingTop: '50%',
    backgroundColor: theme.palette.grey[700],
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
  },
  imageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAreaBackground: {
    // https://stackoverflow.com/questions/62347162/crossfading-element-wide-image-using-css-blur-and-opacity-causes-problem-in-chro
    // https://stackoverflow.com/questions/28870932/how-to-remove-white-border-from-blur-background-image/42963980#42963980
    // browser issue causes blurred, overflowing images
    // to have overflowed borders blurred with their background colour
    //
    // to get around this:
    //
    // overflow: hidden; is applied to the parent
    // the child scaled out
    //
    transform: 'scale(1.1)',
  },
  buttonArea: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  input: {
    display: "none"
  },
  fab: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  imgBackground: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    filter: 'brightness(50%) blur(10px)',
  },
  imgForeground: {
    height: '110%',
    width: '110%',
    objectFit: 'contain',
  },
  actionList: {
    position: 'absolute',
    paddingRight: theme.spacing(1),
    display: 'inline',
    bottom: 0,
    right: 0,
  },
  actionItem: {
    //
  },
}));
export interface IImagePickerFallback { __remember?: unknown; src: OrUndefined<string>; }
export interface IImagePickerProps {
  isLoading?: boolean;
  image: OrUndefined<File>;
  fallback?: IImagePickerFallback;
  className?: string;
  onChange: OrUndefined<IImagePickerOnChange>;
  style?: CSSProperties;
}
export function ImagePicker(props: IImagePickerProps): JSX.Element {
  const { isLoading, fallback, style, image, onChange, className } = props;
  const classes = useImagePickerStyles();
  const [state, setState] = useState<IImagePickerState>(() => reduceState(undefined, { image }));
  useUpdate(() => { setState(reduceState(state, { image })); }, [image]);
  const chooseId = useMemo(() => nanoid(), []);
  const src = state.src ?? fallback?.src;
  return (
    <div style={style} className={clsx(classes.card, className)}>
      {/* fallback or picked */}
      {(src) && (
        <>
          <div className={clsx(classes.imageArea, classes.imageAreaBackground)}>
            <img className={clsx(classes.imgBackground)} src={src} />
          </div>
          <div className={clsx(classes.imageArea)} >
            <img className={clsx(classes.imgForeground)} src={src} />
          </div>
        </>
      )}

      {/* loading */}
      {(!src && isLoading) && (
        <div className={clsx(classes.imageArea)}>
          <CircularProgress size="lg" />
        </div>
      )}

      {/* no image */}
      {(!src && !isLoading) && (
        <div className={clsx(classes.imageArea)}>
          <Icons.Error fontSize="large" />
        </div>
      )}

      {/* floating buttons */}
      <div className={classes.buttonArea}>
        <input
          id={chooseId}
          accept="image/*"
          className={classes.input}
          multiple={false}
          type="file"
          onChange={(evt) => {
            const file = evt.target.files?.[0];
            if (file) onChange?.(file);
            else onChange?.(undefined);
          }}
        />
        <label className={classes.actionItem} htmlFor={chooseId}>
          <Fab component="span" color="primary" className={clsx(classes.fab)}>
            <Icons.AddPhoto />
          </Fab>
        </label>
        <span className={classes.actionItem}>
          <Fab color="primary" className={clsx(classes.fab)}>
            <Icons.Collections />
          </Fab>
        </span>
      </div>
    </div>
  );
}
