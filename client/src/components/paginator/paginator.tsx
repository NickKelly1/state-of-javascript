import { TablePagination } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc"
import { PaginationFragment } from "../../generated/graphql";
import { OrNullable } from "../../types/or-nullable.type";
import { OrPromise } from "../../types/or-promise.type";

export interface IOnChangePageFnArg {
  page: number;
  offset: number;
  page_number: number;
}
export interface IOnChangePageFn {
  (arg: IOnChangePageFnArg): OrPromise<void>;
}
export interface IOnChangeRowsPerPageFnArg {
  limit: number;
}
export interface IOnChangeRowsPerPageFn {
  (arg: IOnChangeRowsPerPageFnArg): OrPromise<void>;
}

interface IPaginatorProps {
  pagination: PaginationFragment;
  perPage?: OrNullable<number[]>;
  onChangePage?: OrNullable<IOnChangePageFn>;
  onChangeRowsPerPage?: OrNullable<IOnChangeRowsPerPageFn>;
}

const defaultPerPageOptions: number[] = [
  5,
  10,
  15,
  30,
  50,
  100,
];

export const Paginator = WithApi<IPaginatorProps>((props) => {
  const {
    pagination,
    perPage,
    onChangePage,
    onChangeRowsPerPage,
  } = props;

  const {
    limit,
    more,
    offset,
    page_number,
    pages,
    total,
  } = pagination;

  const _perPage = perPage ?? defaultPerPageOptions;

  const handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void = useCallback(
    (evt, page) => {
      // mui 0 indexes page
      const pageNumber = page + 1;
      const nextOffset = page * limit;
      const arg: IOnChangePageFnArg = { offset: nextOffset, page, page_number: pageNumber, };
      onChangePage?.(arg);
      // router.push({ query: { ...router.query, offset: encodeURI(nextOffset.toString()), }, });
    },
    [onChangePage],
  );

  const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    (evt) => {
      const nextLimit = evt.target.value;
      const arg: IOnChangeRowsPerPageFnArg = { limit: Number(nextLimit), }
      onChangeRowsPerPage?.(arg);
    },
    [onChangeRowsPerPage, limit],
  );

  const perPageOptions = useMemo(() => Array
    .from(new Set(_perPage.concat(limit)))
    .sort((a, b) => a - b),
    [_perPage, limit],
  );

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={perPageOptions}
      count={total}
      // mui 0 indexes page
      page={page_number - 1}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      rowsPerPage={limit}
    />
  )
});
