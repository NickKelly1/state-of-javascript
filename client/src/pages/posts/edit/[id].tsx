import React from "react";
import {
  BlogPostMutateFormQueryVariables,
  BlogPostMutateFormQuery,
} from "../../../generated/graphql";
import { useQuery } from "react-query";
import { ApiException } from "../../../backend-api/api.exception";
import { WithApi } from "../../../components-hoc/with-api/with-api.hoc";
import { BlogPostMutateForm, blogPostMutateFormQuery, blogPostMutateFormQueryName } from "../../../components/blog-posts/blog-post-mutate.form";
import { WithLoadable } from "../../../components-hoc/with-loadable/with-loadable";
import { useRouter } from "next/router";



// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEditBlogPostPageProps {
  //
}

export const EditBlogPostPage = WithApi<IEditBlogPostPageProps>((props) => {
  const { api, me, } = props;
  const router = useRouter();
  const id = Number(router.query.id);

  const query = useQuery<BlogPostMutateFormQuery, ApiException>(
    [blogPostMutateFormQueryName, me.hash, id],
    async () => {
      const vars: BlogPostMutateFormQueryVariables = { blog_post_id: id, };
      const result = await api.gql<BlogPostMutateFormQuery, BlogPostMutateFormQueryVariables>(
        blogPostMutateFormQuery,
        vars,
      );
      return result;
    },
  );

  const data = query.data?.blogPosts.nodes[0];
  const error = query.error;
  const isLoading = query.isLoading;

  return (
    <WithLoadable
      data={data}
      error={error}
      isLoading={isLoading}
    >
      {(item) => (
        <BlogPostMutateForm
          initial={item}
        />
      )}
    </WithLoadable>
  );
});

export default EditBlogPostPage;