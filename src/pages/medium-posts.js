import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'

class MediumPosts extends Component {
  render() {
    return (
      <Layout>
        {this.props.data.Posts.edges.map(edge => <h2 key={edge.node.id}>{edge.node.title}</h2>)}
      </Layout>
    )
  }
}

MediumPosts.propTypes = {
  data: PropTypes.object.isRequired,
}

const query = graphql`
    query mediumQuery {
        Posts: allMediumPost(sort: { fields: [createdAt], order: DESC }) {
            edges {
                node {
                    id
                    title
                    virtuals {
                        subtitle
                        previewImage {
                            imageId
                        }
                    }
                    author {
                        name
                    }
                }
            }
        }
    }
`

export default () =>
  <StaticQuery
    query={query}
    render={data => <MediumPosts data={data}/>}
  />
