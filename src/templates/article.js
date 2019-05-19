import React from 'react'
import ArticleLayout from '../components/article-layout'
import { graphql } from 'gatsby'

export default ( { data: {markdownRemark: post} } ) => {
console.log(post);
  return (
    <ArticleLayout>
      <h1 id='article-title'>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      <h2>Here we'll put the Twitter link and stuff.</h2>
    </ArticleLayout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
