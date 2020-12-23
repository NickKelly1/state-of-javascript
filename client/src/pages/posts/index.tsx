import { gql } from "graphql-request";
import { staticPropsHandler } from "../../helpers/static-props-handler.helper";
import { FindBlogPostsQuery, FindBlogPostsQueryVariables, } from '../../generated/graphql';
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { ist } from "../../helpers/ist.helper";
import React from "react";
import { Markdown } from "../../components/markdown/markdown";



const pageQuery = gql`
query FindBlogPosts{
  blogPosts(
    query:{
      limit:5
      sorts:[
        {field:"updated_at", dir:Desc}
      ]
    }
  ){
    nodes{
      data{
        id
        title
        teaser
        body
      }
      relations{
        status{
          data{
            id
            name
            colour
          }
        }
      }
    }
  }
}
`;


interface IPostsPageProps {
  query: FindBlogPostsQuery;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

function PostsPage(props: IPostsPageProps): JSX.Element {
  const { query } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      {query.blogPosts.nodes.filter(ist.defined).map(blogPost => (
        <>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
          >
            {blogPost.data.title}
          </Typography>
          <Typography
            style={{ color: blogPost.relations.status?.data.colour }}
            variant="h2"
            component="h2"
            gutterBottom
          >
            {blogPost.relations.status?.data.name}
          </Typography>
          <Markdown>
            {blogPost.data.teaser}
          </Markdown>
          <Markdown>
            {blogPost.data.body}
          </Markdown>
        </>
      ))}
    </Paper>
  );
}

export default PostsPage;

export const getStaticProps = staticPropsHandler<IPostsPageProps>(async ({ api }) => {
  const query = await api.gql<FindBlogPostsQuery, FindBlogPostsQueryVariables>(
    pageQuery,
    {},
  );

  const props: IPostsPageProps = {
    query,
  };

  return {
    props,
  };
});
