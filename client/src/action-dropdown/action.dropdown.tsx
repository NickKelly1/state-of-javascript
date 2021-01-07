import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import NextLink from 'next/link';
import MUILink from '@material-ui/core/Link';
import { Icons } from "../components/icons/icons.const";
import { INodeable } from "../helpers/nodeify.helper";
import { ThemeColourKey, useThemeColours } from "../hooks/use-theme-colours.hook";
import { OrPromise } from "../types/or-promise.type";
import { OrNullable } from "../types/or-nullable.type";
import { IIdentityFn } from "../types/identity-fn.type";


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export interface IActionItem<T = any, E = any> {
// interface IActionItem<T = unknown, E = unknown> {
  key: string;
  onClick?: OrNullable<() => OrPromise<T>>;
  href?: OrNullable<string>;
  onMutate?: OrNullable<() => OrPromise<void>>;
  onError?: OrNullable<(error: E) => OrPromise<void>>;
  onSuccess?: OrNullable<(success: T) => OrPromise<void>>;
  icon?: OrNullable<INodeable>;
  text?: OrNullable<INodeable>;
  disabled?: OrNullable<boolean>;
  color?: OrNullable<ThemeColourKey>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IActionDropdownProps {
  actions: IActionItem[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ActionDropdown(props: IActionDropdownProps): JSX.Element {
  const { actions, } = props;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleMenuClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => { setMenuAnchor(evt.currentTarget); }, []);
  const handleMenuClose = useCallback(() => { setMenuAnchor(null); }, []);

  return (
    <>
      <Button
        startIcon={menuAnchor
          ? <Icons.ArrowDropUp />
          : <Icons.ArrowDropDown />}
        variant="outlined"
        color="primary"
        onClick={handleMenuClick}
      >
        More Actions
      </Button>
      <Menu
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
        open={!!menuAnchor}
        keepMounted={false}
      >
        {actions.map(action => (
          <ActionItem
            key={action.key}
            item={action}
            onMenuClose={handleMenuClose}
          />
        ))}
      </Menu>
    </>
  );
}

interface IActionItemProps<T, E> {
  item: IActionItem<T, E>;
  onMenuClose: IIdentityFn;
}

function ActionItem<T, E>(props: IActionItemProps<T, E>): JSX.Element {
  const {
    item,
    onMenuClose,
    ...otherProps
  } = props;
  const {
    key,
    color,
    disabled,
    href,
    icon,
    onClick,
    onError,
    onMutate,
    onSuccess,
    text,
  } = item;

  const themes = useThemeColours();
  const colorClassName = useMemo<string | undefined>(() => {
    if (color && (color in themes)) { return themes[color]; }
    return undefined;
  }, [color]);


  const handleClick = useCallback(async () => {
    onMenuClose();
    onMutate?.();
    if (!onClick) return undefined;
    try {
      const result = await onClick();
      onSuccess?.(result);
    } catch (error) {
      if (item.onError) {
        onError?.(error);
      } else {
        console.error('Unhandled DropdownItemError', error);
      }
    }
  }, [onClick]);


  const displayJsx = (
    <>
      {icon && (
        <ListItemIcon className={clsx(colorClassName)}>
          {icon}
        </ListItemIcon>
      )}
      <ListItemText className={clsx(colorClassName)}>
        {text}
      </ListItemText>
    </>
  );

  return (
    <MenuItem {...otherProps} disabled={disabled || false} onClick={handleClick}>
      {href && (
        <NextLink href={href} passHref>
          <MUILink className="btn-link centered row" color="inherit">
            {displayJsx}
          </MUILink>
        </NextLink>
      )}
      {!href && (displayJsx)}
    </MenuItem>
  );
}
