import React from 'react'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import { CSSTransition } from 'react-transition-group'

import me from '../assets/images/main/me.jpg'
import { travelDescriptions } from '../utilities/constants'

class Homepage extends React.Component {
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
    const { showChevrons, currentImage, imageIndex, showPhotography } = this.state
    const imageSizes = currentImage.childImageSharp.sizes
    const imageName = currentImage.name

    return (
      <div>
        <Helmet/>

        <section id="aboutMe" className="main style1">
          <div className="grid-wrapper">
            <div className="col-6">
              <header className="major">
                <h2>About Me</h2>
              </header>
              <p>Hi, it's me. I live in Gothenburg, Sweden and work for a great little startup connecting schools and
                substitute teachers.</p>
              <p>We work with React and Rails and get to do everything from brainstorm feature ideas to pick the colors
                for buttons.</p>
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <a href='http://www.medium.com/@heyamberwilkie' target='_new'>Tech Blog</a>
                <a style={{ cursor: 'pointer' }}
                   className={showPhotography ? 'chevron-below' : ''}
                   onClick={() => this.setState({ showPhotography: !this.state.showPhotography })}>Photography</a>
              </div>
            </div>
            <div className="col-6">
              <span className="image fit"><img src={me} alt=""/></span>
            </div>
          </div>
        </section>

        {showPhotography && (<section id="photography" className="main style2">
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
                <p>{travelDescriptions[imageIndex]}</p>
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
        </section>)}
      </div>
    )
  }
}

Homepage.propTypes = {
  route: React.PropTypes.object,
}

export default Homepage

export const pageQuery = graphql`
    query allImgsQuery {
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
