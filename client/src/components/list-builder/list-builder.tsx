import { Box, Grid, List, ListItem, makeStyles, Button, Typography } from "@material-ui/core";
import { Flip,  } from "@material-ui/icons";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import RestoreIcon from '@material-ui/icons/Restore';
import clsx from "clsx";
import { produce } from 'immer';
import React, { FormEventHandler, MouseEventHandler, useCallback, useMemo, useState } from "react";
import { ApiException } from "../../backend-api/api.exception";
import { ist } from "../../helpers/ist.helper";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { useUpdate } from "../../hooks/use-update.hook";
import { Id } from "../../types/id.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { OrUndefined } from "../../types/or-undefined.type";

export type IListBuilderItemKeyFn<T> = ((arg: { list: number, index: number, item: IListBuilderItem<T> }) => React.Key);
export type IListBuilderItemKey<T> = keyof T | IListBuilderItemKeyFn<T>;
export type IListBuilderItemAccessorFn<T> = ((arg: { list: number, index: number, item: IListBuilderItem<T> }) => INodeable);
export type IListBuilderItemAccessor<T> = keyof T | IListBuilderItemAccessorFn<T>;
export interface IListBuilderConfig<T> {
  names?: OrNull<[OrNullable<string>, OrNullable<string>]>;
  key: IListBuilderItemKey<T>;
  accessor: IListBuilderItemAccessor<T>;
}
export interface IListBuilderItem<T> { disabled: boolean; data: T; }
export type IListBuilderLists<T> = [IListBuilderItem<T>[], IListBuilderItem<T>[]];

const useListBuilderStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  listContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexGrow: 1,
  },
  center: {
    // display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // flexDirection: 'column',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}));

function getRowKey<T>(config: IListBuilderConfig<T>, list: number, index: number, item: IListBuilderItem<T>): React.Key {
  if (ist.fn(config.key)) return config.key({ list, index, item });
  return String(item.data[config.key]);
}

function getRowNode<T>(config: IListBuilderConfig<T>, list: number, index: number, item: IListBuilderItem<T>): INodeable {
  if (ist.fn(config.accessor)) return config.accessor({ list, index, item });
  const result = item.data[config.accessor];
  return result;
}
export interface IListBuilderOnChangeFnArg<T> { lists: IListBuilderLists<T>; }
export interface IListBuilderOnChangeFn<T> { (arg: IListBuilderOnChangeFnArg<T>): any; }
export interface IListBuilderProps<T> {
  className?: OrNullable<string>;
  onChange?: OrNull<IListBuilderOnChangeFn<T>>;
  lists: IListBuilderLists<T>;
  config: IListBuilderConfig<T>;
  disabled?: OrNull<boolean>;
  error?: OrNull<ApiException>;
}

export function ListBuilder<T>(props: IListBuilderProps<T>) {
  const { lists, config, onChange, disabled, error, className, } = props;
  const classes = useListBuilderStyles();

  const [_initialState] = useState(lists);

  const handleReset: MouseEventHandler<HTMLButtonElement> = useCallback(
    () => { onChange?.({ lists: _initialState }); },
    [onChange],
  );

  const handleItemClicked = useCallback(
    (list: number, index: number, item: IListBuilderItem<T>) => {
      if (onChange) {
        const next = produce<IListBuilderLists<T>, IListBuilderLists<T>, IListBuilderLists<T>>(lists, (next) => {
          const from = list;
          const to = (list === 0) ? 1 : 0;
          next[from].splice(index, 1);
          next[to].push(item);
          return next;
        });
        onChange({ lists: next });
      }
    },
    [lists, onChange],
  );

  const handleSwapAllClicked = useCallback((list: number) => {
    if (onChange) {
      if (list === 0) {
        const list0: IListBuilderItem<T>[] = Array.from(lists[0]);
        const list1: IListBuilderItem<T>[] = [];
        lists[1].forEach(item => !item.disabled ? list0.push(item) : list1.push(item));
        const next: IListBuilderLists<T> = [list0, list1];
        return onChange?.({ lists: next });
      } else {
        const list1: IListBuilderItem<T>[] = Array.from(lists[1]);
        const list0: IListBuilderItem<T>[] = [];
        lists[0].forEach(item => !item.disabled ? list1.push(item) : list0.push(item));
        const next: IListBuilderLists<T> = [list0, list1];
        return onChange?.({ lists: next });
      }
    }
  }, [lists, onChange]);

  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.listContainer}>
        <ListBuilderListItems
          className="full-width"
          config={config}
          listIndex={0}
          list={lists[0]}
          disabled={disabled}
          onItemClicked={handleItemClicked}
        />
      </div>
      <div className={clsx(classes.center)}>
        <Box mb={2}>
          <Button disabled={!!disabled} className="m-auto d-flex" variant="outlined" onClick={() => handleSwapAllClicked(1)}>
            <DoubleArrowIcon />
          </Button>
        </Box>
        <Box mb={2}>
          <Button disabled={!!disabled} className="m-auto d-flex" variant="outlined" onClick={handleReset}>
            <RestoreIcon />
          </Button>
        </Box>
        <Box mb={2}>
          <Button disabled={!!disabled} className="m-auto d-flex" variant="outlined" onClick={() => handleSwapAllClicked(0)}>
            <DoubleArrowIcon className="rotate-180" />
          </Button>
        </Box>
      </div>
      <div className={classes.listContainer}>
        <ListBuilderListItems
          className="full-width"
          config={config}
          listIndex={1}
          list={lists[1]}
          disabled={disabled}
          onItemClicked={handleItemClicked}
        />
      </div>
    </div>
  );
}

const useListBuilderListItemsStyles = makeStyles((theme) => ({
  root: {
    //
  },
  itemContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
}));

interface IListBuilderListOnItemClickedFn<T> { (list: number, index: number, item: IListBuilderItem<T>): any; }
interface IListBuilderListItemsProps<T> {
  className?: OrNullable<string>;
  config: IListBuilderConfig<T>;
  listIndex: number;
  list: IListBuilderItem<T>[]
  disabled?: OrNullable<boolean>;
  onItemClicked?: IListBuilderListOnItemClickedFn<T>;
}

function ListBuilderListItems<T>(props: IListBuilderListItemsProps<T>) {
  const { config, listIndex, list, onItemClicked, disabled, className } = props;

  const classes = useListBuilderListItemsStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Box className="text-center" border={2} borderRadius="borderRadius" py={1} borderColor="grey.500">
        <Box p={2} borderBottom={2}>
          <Typography color={disabled ? 'textSecondary' : 'inherit'} component="h4" variant="h4">
            {config.names?.[listIndex]}
          </Typography>
        </Box>
        <List className={classes.itemContainer}>
          {list.map((item, itemIndex) => {
            const node = getRowNode(config, listIndex, itemIndex, item);
            const key = getRowKey(config, listIndex, itemIndex, item);
            return (
              <ListItem
                key={key}
                disabled={disabled || item.disabled}
                button
                onClick={() => onItemClicked?.(listIndex, itemIndex, item)}
              >
                {nodeify(node)}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </div>
  )
}