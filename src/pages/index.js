import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Photography from '../components/Photography'
import Miscellaneous from '../components/Miscellaneous'
import me from '../assets/images/main/me.png'

class IndexPage extends React.Component {
  state = {}

  ChevronLink = ( toggle, text ) =>
    <span
      className={`link ${this.state[toggle] ? 'chevron-below' : ''}`}
      onClick={() => this.setState({
        showPhotography: false,
        showMiscellaneous: false,
        [toggle]: !this.state[toggle],
      })}>
    {text}
  </span>

  render() {
    const { showMiscellaneous, showPhotography } = this.state

    return (
      <Layout>
        <div>
          <Helmet>
            <meta charSet="utf-8"/>
            <title>Amber Wilkie, Software Engineer</title>
          </Helmet>

          <section id="aboutMe" className="main style1">
            <div className="grid-wrapper">
              <div className="col-6">
                <header className="major">
                  <h2>About Me</h2>
                </header>
                <p>Hi, it's me. I live in Amsterdam and work remotely for a
                  great little startup connecting schools and substitute teachers.</p>
                <p>We work with React and Rails and get to do everything from brainstorm feature ideas to pick the
                  colors for buttons.</p>
                <div className='about-me-links'>
                  <a href='http://www.medium.com/@heyamberwilkie' target='_new'>Tech Blog</a>
                  {this.ChevronLink('showPhotography', 'Photography')}
                  {this.ChevronLink('showMiscellaneous', 'Etc')}
                </div>
              </div>
              <div className="col-6">
                <span className="image fit"><img src={me} alt="Amber near Dresden, Germany"/></span>
              </div>
            </div>
          </section>
          {showPhotography && <Photography/>}
          {showMiscellaneous && <Miscellaneous/>}
        </div>
      </Layout>
    )
  }
}

export default IndexPage
