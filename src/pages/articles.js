import React from 'react'
import { Link, graphql } from 'gatsby'

class Articles extends React.Component {
  render() {
    const { edges } = this.props.data.allMarkdownRemark
    const articles = edges.map(edge => edge.node)
    return (
      <section id="articles">
        <div className="inner">
          {articles.filter(article => !article.frontmatter.draft).map(article => (
            <div key={article.id}>
              <Link to={article.fields.slug}>
                <h2>{article.frontmatter.title}</h2>
                <h3>{article.frontmatter.subtitle}</h3>
              </Link>
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            draft
            title
            subtitle
            date(formatString: "DD MMMM YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
