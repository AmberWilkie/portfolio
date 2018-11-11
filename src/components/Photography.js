import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'
import { CSSTransition } from 'react-transition-group'

import { travelDescriptions } from '../utilities/constants'


class Photography extends Component {
  state = {
    currentImage: this.props.data.Images.edges[0].node,
    imageIndex: 0,
  }

  incrementImage = change => {
    let index = this.state.imageIndex
    if (!this.props.data.Images.edges[index + change]) {
      index = change === 1 ? -1 : this.props.data.Images.edges.length
    }

    this.setState({ animate: true }, () => {

      this.setState({
        currentImage: this.props.data.Images.edges[index + change].node,
        imageIndex: index + change,
        animate: false,
      })
    })
  }

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
            <div key={imageName}
                 onMouseEnter={() => this.setState({ showChevrons: !showChevrons })}
                 onMouseLeave={() => this.setState({ showChevrons: !showChevrons })}>
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
                          onClick={() => this.incrementImage(-1)}
                    />
                <span style={{ display: showChevrons ? '' : 'none' }}
                      className='fa icon fa-chevron-right chevron-right'
                      onClick={() => this.incrementImage(1)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

Photography.propTypes = {}

export default Photography;
