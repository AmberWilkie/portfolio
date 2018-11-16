import React from 'react'
import '../assets/scss/main.scss'

import Header from '../components/Header'
import Footer from '../components/Footer'

class Template extends React.Component {
  render() {
    return (
      <div className='body'>
        <Header/>
        {this.props.children(this.props)}
        <Footer/>
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
}

export default Template

export const pageQuery = graphql`
    query siteQuery {
        Images: allFile(
            sort: {order: ASC, fields: [absolutePath]}
            filter: {relativePath: {regex: "/travel/"}}
        ) {
            edges {
                node {
                    relativePath
                    name
                    childImageSharp {
                        sizes(maxWidth: 1500) {
                            ...GatsbyImageSharpSizes
                        }
                    }
                }
            }
        }
        Posts: allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 1000
        ) {
            edges {
                node {
                    excerpt(pruneLength: 250)
                    html
                    id
                    frontmatter {
                        date
                        title
                    }
                }
            }
        }
    }
`
