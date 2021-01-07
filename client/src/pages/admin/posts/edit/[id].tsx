import React from "react";
import {
  BlogPostMutateFormQueryVariables,
  BlogPostMutateFormQuery,
} from "../../../../generated/graphql";
import { useQuery } from "react-query";
import { ApiException } from "../../../../backend-api/api.exception";
import { WithApi } from "../../../../components-hoc/with-api/with-api.hoc";
import {
  BlogPostMutateForm,
  IBlogPostMutateFormData,
} from "../../../../components/blog-posts/blog-post-mutate.form";
import { WithLoadable } from "../../../../components-hoc/with-loadable/with-loadable";
import { useRouter } from "next/router";
import { OrUndefined } from "../../../../types/or-undefined.type";
import { blogPostMutateFormQueryName, BLOG_POST_MUTATE_FORM_QUERY } from "../../../../components/blog-posts/blog-post-mutate.queries";
import { blogPostMutateToFormData } from "../../../../components/blog-posts/blog-post-mutate.dropdown";



// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEditBlogPostPageProps {
  //
}

export const EditBlogPostPage = WithApi<IEditBlogPostPageProps>((props) => {
  const { api, me, } = props;
  const router = useRouter();
  const id = Number(router.query.id);

  const query = useQuery<OrUndefined<IBlogPostMutateFormData>, ApiException>(
    [blogPostMutateFormQueryName, me.hash, id],
    async (): Promise<OrUndefined<IBlogPostMutateFormData>> => {
      const vars: BlogPostMutateFormQueryVariables = {
        query: {
          offset: 0,
          limit: 1,
          filter: [{ attr: { id: { eq: id, } } }],
        },
      };
      const result = await api.gql<BlogPostMutateFormQuery, BlogPostMutateFormQueryVariables>(
        BLOG_POST_MUTATE_FORM_QUERY,
        vars,
      );
      const item = result.blogPosts.nodes?.[0];
      if (!item) return undefined;
      return blogPostMutateToFormData(item);
    },
  );

  const data = query.data;
  const error = query.error;
  const isLoading = query.isLoading;

  return (
    <WithLoadable
      data={data}
      error={error}
      isLoading={isLoading}
    >
      {(initial) => (
        <BlogPostMutateForm
          initial={initial}
        />
      )}
    </WithLoadable>
  );
});

export default EditBlogPostPage;