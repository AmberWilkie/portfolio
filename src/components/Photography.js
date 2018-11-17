import React, { Component } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import { travelDescriptions } from '../utilities/constants'

class Photography extends Component {
  state = {
    currentImage: this.props.data.Images.edges[0].node,
    imageIndex: 0,
  }

  changeImage = change => {
    let index = this.state.imageIndex
    const { edges } = this.props.data.Images
    if (!edges[index + change]) {
      index = change === 1 ? -1 : edges.length
    }

    this.setState({ animate: true }, () => {

      this.setState({
        currentImage: edges[index + change].node,
        imageIndex: index + change,
        animate: false,
      })
    })
  }

  toggleChevrons = () => this.setState({ showChevrons: !this.state.showChevrons })

  render() {
    const { showChevrons, currentImage } = this.state
    const imageSizes = currentImage.childImageSharp.sizes
    const imageName = currentImage.name

    return (
      <section id="photography" className="main style2">
        <div className="grid-wrapper">
          <div className='col-3'>
            <header className="major">
              <h2>Photography</h2>
            </header>
            <CSSTransition
              in={this.state.animate}
              timeout={300}
              classNames="fade"
            >
              <div>
                <p>{travelDescriptions[imageName].text}</p>
                {travelDescriptions[imageName].paragraph && <p>{travelDescriptions[imageName].paragraph}</p>}
                {travelDescriptions[imageName].link &&
                <a href={travelDescriptions[imageName].link} target='_new'>More</a>}
              </div>
            </CSSTransition>
          </div>
          <div className="col-9">
            <div key={imageName} onMouseEnter={this.toggleChevrons} onMouseLeave={this.toggleChevrons}>
              <div>
                <Img
                  title={imageName}
                  alt={imageName}
                  sizes={imageSizes}
                  className="border-radius"
                />
              </div>
              <div className='chevron-container'>
                <span style={{ display: showChevrons ? '' : 'none' }}
                      className='fa icon fa-chevron-left chevron-left'
                      onClick={() => this.changeImage(-1)}
                />
                <span style={{ display: showChevrons ? '' : 'none' }}
                      className='fa icon fa-chevron-right chevron-right'
                      onClick={() => this.changeImage(1)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

Photography.propTypes = {
  data: PropTypes.object.isRequired,
}

const query = graphql`
    query imagesQuery {
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
    }
`
export default () =>
  <StaticQuery
    query={query}
    render={data => <Photography data={data}/>}
  />
