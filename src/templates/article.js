import React from 'react'
import ArticleLayout from '../components/article-layout'
import { graphql } from 'gatsby'
import { FaEnvelope, FaTwitter, FaDev } from "react-icons/fa";
import { ShareButtonRectangle, ShareBlockStandard } from "react-custom-share";

export default ( props) => {
  const { data: {markdownRemark: post}, location: { href: url } } = props;
  const shareBlockProps = {
    url,
    button: ShareButtonRectangle,
    buttons: [
      { network: "Twitter", icon: FaTwitter },
      { network: "Email", icon: FaEnvelope },
      // { network: "DevCommunity", icon: FaDev },
    ],
    text: `"${post.frontmatter.title}" by @heyamberwilkie`,
  };

  return (
    <ArticleLayout>
      <h1 id='article-title'>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      <div className='twitter-post-link'>
        <ShareBlockStandard {...shareBlockProps} />
      </div>
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
