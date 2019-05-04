import React from 'react'
import { graphql } from 'gatsby'

class Articles extends React.Component {
  render() {
    console.log(this.props);
    const { edges } = this.props.data.allMarkdownRemark
    const articles = edges.map(edge => edge.node)
    return (
      <section id="articles">
        <div className="inner">
          {articles.map(article => (
            <div>
              <h2>{article.frontmatter.title}</h2>
              <strong>{article.frontmatter.date}</strong>
              <p>{article.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
}

export default Articles

export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`
