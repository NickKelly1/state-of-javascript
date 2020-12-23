import React from "react";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { BlogPostMutateForm } from "../../components/blog-posts/blog-post-mutate.form";



// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICreateBlogPostPageProps {
  //
}

const CreateBlogPostPage = WithApi<ICreateBlogPostPageProps>((props) => {
  const { api, me } = props;

  return (
    <BlogPostMutateForm
      // id={undefined}
      // onSuccess={handleSuccess}
      // onAutoSave={undefined}
      // error={error}
      // isDisabled={isDisabled}
      // isLoading={isLoading}
      // lastSavedAt={undefined}
      initial={null}
    />
  );
})

export default CreateBlogPostPage;