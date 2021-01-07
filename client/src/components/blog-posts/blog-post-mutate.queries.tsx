import { gql } from "graphql-request";
import { USER_DATA_GQL_FRAGMENT } from "../users/user.data.gql.fragment";
import { BLOG_POST_ACTIONS_GQL_FRAGMENT } from "./blog-post.actions.gql.fragment";
import { BLOG_POST_DATA_GQL_FRAGMENT } from "./blog-post.data.gql.fragment";
import { BLOG_POST_STATUS_DATA_GQL_FRAGMENT } from "../blog-post-statuses/blog-post-status.data.gql.fragment";
import { BLOG_POST_STATUS_ACTIONS_GQL_FRAGMENT } from "../blog-post-statuses/blog-post-status.actions.gql.fragment";
import { IMAGE_DATA_GQL_FRAGMENT } from "../images/image-data.gql.fragment";
import { IMAGE_ACTIONS_GQL_FRAGMENT } from "../images/image-actions.gql.fragment";
import { FILE_DATA_GQL_FRAGMENT } from "../files/file-data.gql.fragment";
import { FILE_ACTIONS_GQL_FRAGMENT } from "../files/file-actions.gql.fragment";


/**
 * BlogPostData Fragment
 */
export const BLOG_POST_MUTATE_DATA_GQL_FRAGMENT  = gql`
fragment BlogPostMutateData on BlogPostNode{
  cursor
  data{ ...BlogPostData }
  can{ ...BlogPostActions }
  relations{
    author{
      data{ ...UserData }
    }
    status{
      data{ ...BlogPostStatusData }
      can{ ...BlogPostStatusActions }
    }
    image{
      data{ ...ImageData }
      can{ ...ImageActions }
      relations{
        original{
          data{ ...FileData }
          can{ ...FileActions }
        }
        thumbnail{
          data{ ...FileData }
          can{ ...FileActions }
        }
        display{
          data{ ...FileData }
          can{ ...FileActions }
        }
      }
    }
  }
}
${BLOG_POST_ACTIONS_GQL_FRAGMENT}
${BLOG_POST_DATA_GQL_FRAGMENT}
${USER_DATA_GQL_FRAGMENT}
${BLOG_POST_STATUS_DATA_GQL_FRAGMENT}
${BLOG_POST_STATUS_ACTIONS_GQL_FRAGMENT}
${IMAGE_DATA_GQL_FRAGMENT}
${IMAGE_ACTIONS_GQL_FRAGMENT}
${FILE_DATA_GQL_FRAGMENT}
${FILE_ACTIONS_GQL_FRAGMENT}
`



// query can be used elsewhere in parents...
export const blogPostMutateFormQueryName = 'BlogPostMutateFormQuery';
export const BLOG_POST_MUTATE_FORM_QUERY = gql`
query BlogPostMutateForm(
  $query:BlogPostQuery
){
  blogPosts(query:$query){
    nodes { ...BlogPostMutateData }
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Update a Blog Post
 */
export const BLOG_POST_UPDATE_MUTATION = gql`
mutation BlogPostUpdate(
  $id:Int!
  $title:String
  $teaser:String
  $body:String
){
  updateBlogPost(
    dto:{
      id:$id
      title:$title
      teaser:$teaser
      body:$body
    }
  ){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`


/**
 * Create a Blog Post
 */
export const BLOG_POST_CREATE_MUTATION = gql`
mutation BlogPostCreate(
  $title:String!
  $teaser:String!
  $body:String!
  $image:Upload!
){
  createBlogPost(
    dto:{
      title:$title
      teaser:$teaser
      body:$body
      image:$image
    }
  ){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`


/**
 * Soft Delete a Blog Post
 */
export const BLOG_POST_SOFT_DELETE_MUTATION = gql`
mutation BlogPostSoftDelete(
  $id:Int!
){
  softDeleteBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * HardDelete a Blog Post
 */
export const BLOG_POST_HARD_DELETE_MUTATION = gql`
mutation BlogPostHardDelete(
  $id:Int!
){
  hardDeleteBlogPost(dto:{id:$id})
}
`;


/**
 * Restore a Blog Post
 */
export const BLOG_POST_RESTORE_MUTATION = gql`
mutation BlogPostRestore(
  $id:Int!
){
  restoreBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Submit a Blog Post
 */
export const BLOG_POST_SUBMIT_MUTATION = gql`
mutation BlogPostSubmit(
  $id:Int!
){
  submitBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Reject a Blog Post
 */
export const BLOG_POST_REJECT_MUTATION = gql`
mutation BlogPostReject(
  $id:Int!
){
  rejectBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Approve a Blog Post
 */
export const BLOG_POST_APPROVE_MUTATION = gql`
mutation BlogPostApprove(
  $id:Int!
){
  approveBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Publish a Blog Post
 */
export const BLOG_POST_PUBLISH_MUTATION = gql`
mutation BlogPostPublish(
  $id:Int!
){
  publishBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;


/**
 * Unpublish a Blog Post
 */
export const BLOG_POST_UNPUBLISH_MUTATION = gql`
mutation BlogPostUnpublish(
  $id:Int!
){
  unpublishBlogPost(dto:{id:$id}){
    ...BlogPostMutateData
  }
}
${BLOG_POST_MUTATE_DATA_GQL_FRAGMENT}
`;
