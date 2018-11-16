import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Blog extends Component {
  render() {
    const { edges } = this.props.data.Posts

    return (
      <div className="main style1">
        <div className="grid-wrapper">
          <div className="col-6">
            {edges.map(edge => {
                const { node: post } = edge

                return (
                  <div key={post.id}>
                    <h3>{post.frontmatter.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: post.html }}/>
                  </div>
                )
              },
            )}
          </div>
        </div>
      </div>
    )
  }
}

Blog.propTypes = {}

export default Blog
