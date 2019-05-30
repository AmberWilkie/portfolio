import React, { Component } from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'

class ArticlesSection extends Component {
  render() {
    console.log(this.props)
    const { standalonePage } = this.props
    const { edges } = this.props.data.allMarkdownRemark
    const allArticles = edges.map(edge => edge.node).filter(article => !article.frontmatter.draft)
    const articles = standalonePage ? allArticles : allArticles.slice(0, 5)

    return (
      <div id="photography" className="main style2">
        {standalonePage && (
          <div className='back-link'>
            <Link to='/'>{'<< Home'}</Link>
          </div>
        )}
        <div className="grid-wrapper">
          <div className='col-3'>
            <header className="major">
              <h2>Articles</h2>
            </header>
          </div>
          <div className="inner col-9">
            {articles.filter(article => !article.frontmatter.draft).map(article => (
              <div key={article.id}>
                <Link to={article.fields.slug}>
                  <h4 className='article-title'>
                    {article.frontmatter.title}
                  </h4>
                </Link>
                <p className='article-title'>{article.frontmatter.subtitle}</p>
                <p>
                  <small>{article.frontmatter.date}</small>
                </p>
              </div>
            ))}

            {!standalonePage && (<p>
              <Link to='/articles'>More...</Link>
            </p>)}
          </div>
        </div>
      </div>
    )
  }
}

ArticlesSection.propTypes = {
  standalonePage: PropTypes.bool,
  data: PropTypes.object.isRequired,
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC, limit: 10 }) {
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
        }
      }
    }
  }
`

export default ( props ) => <StaticQuery
  query={query}
  render={data => <ArticlesSection {...props} data={data}/>}
/>
