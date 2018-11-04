import React from 'react'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'

import me from '../assets/images/main/me.jpg'
import pic02 from '../assets/images/pic02.jpg'
import pic03 from '../assets/images/pic03.jpg'
import pic04 from '../assets/images/pic04.jpg'


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
    this.setState({
      currentImage: this.props.data.Images.edges[index + change].node,
      imageIndex: index + change,
    })
  }

  render() {
    const { showChevrons, currentImage } = this.state
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
              <p>We work with React and Rails and get to do everything from brainstorm to pick the colors for
                buttons.</p>
              <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
              <a href='http://www.medium.com/@heyamberwilkie' target='_new'>Tech Blog</a>
              <a href='#photography' onClick={() => this.setState({showPhotography: !this.state.showPhotography})}>Photography</a>
              </div>
              </div>
            <div className="col-6">
              <span className="image fit"><img src={me} alt=""/></span>
            </div>
          </div>
        </section>

        {this.state.showPhotography && (<section id="photography" className="main style2">
          <div className="grid-wrapper">
            <div className='col-12'>
              <header className="major">
                <h2>Photography</h2>
              </header>
              <p>I've seen the world through a camera lens for many years now. Here are some images I made while
                traveling.</p>
            </div>
            <div className="col-12">
              <div key={imageName}
                   onMouseEnter={() => this.setState({ showChevrons: true })}
                   onMouseLeave={() => this.setState({ showChevrons: false })}>
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


        {/*<section id="three" className="main style1 special">*/}
          {/*<div className="grid-wrapper">*/}
            {/*<div className="col-12">*/}
              {/*<header className="major">*/}
                {/*<h2>Adipiscing amet consequat</h2>*/}
              {/*</header>*/}
              {/*<p>Ante nunc accumsan et aclacus nascetur ac ante amet sapien sed.</p>*/}
            {/*</div>*/}

            {/*<div className="col-4">*/}
              {/*<span className="image fit"><img src={pic02} alt=""/></span>*/}
              {/*<h3>Magna feugiat lorem</h3>*/}
              {/*<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat*/}
                {/*et nascetur.</p>*/}
              {/*<ul className="actions">*/}
                {/*<li><a href="#" className="button">More</a></li>*/}
              {/*</ul>*/}
            {/*</div>*/}
            {/*<div className="col-4">*/}
              {/*<span className="image fit"><img src={pic03} alt=""/></span>*/}
              {/*<h3>Magna feugiat lorem</h3>*/}
              {/*<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat*/}
                {/*et nascetur.</p>*/}
              {/*<ul className="actions">*/}
                {/*<li><a href="#" className="button">More</a></li>*/}
              {/*</ul>*/}
            {/*</div>*/}
            {/*<div className="col-4">*/}
              {/*<span className="image fit"><img src={pic04} alt=""/></span>*/}
              {/*<h3>Magna feugiat lorem</h3>*/}
              {/*<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat*/}
                {/*et nascetur.</p>*/}
              {/*<ul className="actions">*/}
                {/*<li><a href="#" className="button">More</a></li>*/}
              {/*</ul>*/}
            {/*</div>*/}

          {/*</div>*/}
        {/*</section>*/}
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
