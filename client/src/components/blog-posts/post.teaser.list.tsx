import React from "react";
import {
  Grid,
} from "@material-ui/core";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { PostTeaser, IPostTeaserData } from "./post.teaser";
import { PaginationFragment } from "../../generated/graphql";
import { IOnChangePageFn, IOnChangeRowsPerPageFn, Paginator } from "../paginator/paginator";
import { OrNullable } from "../../types/or-nullable.type";


export interface IPostTeaserListItem {
  data: IPostTeaserData;
}
export interface IPostTeaserList {
  items: IPostTeaserListItem[];
  pagination: PaginationFragment;
}
export interface IPostTeaserListProps {
  list: IPostTeaserList;
  onChangePage?: OrNullable<IOnChangePageFn>;
  onChangeRowsPerPage?: OrNullable<IOnChangeRowsPerPageFn>;
}

export const PostTeaserList = WithApi<IPostTeaserListProps>((props) => {
  const {
    list,
    api,
    me,
    onChangePage,
    onChangeRowsPerPage,
  } = props;

  if (list.items.length === 0) return null;

  return (
    <Grid container spacing={2}>
      {list.items.map(post => (
        <Grid key={post.data.image} item xs={12}>
          <PostTeaser post={post.data} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Paginator
          pagination={list.pagination}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
});
