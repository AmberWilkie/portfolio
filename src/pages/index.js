import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Photography from '../components/Photography'
import Miscellaneous from '../components/Miscellaneous'
import ArticlesSection from '../components/ArticlesSection';
import me from '../assets/images/main/me-min.png'

class IndexPage extends React.Component {
  state = {}

  ChevronLink = ( toggle, text ) =>
    <span
      className={`link ${this.state[toggle] ? 'chevron-below' : ''}`}
      onClick={() => this.setState({
        showArticles: false,
        showPhotography: false,
        showMiscellaneous: false,
        [toggle]: !this.state[toggle],
      })}>
    {text}
  </span>

  render() {
    const { showArticles, showMiscellaneous, showPhotography } = this.state

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
                <p>Hi, it's me. I live and work in Philly. I'm great at: software development
                  with Ruby and Javascript, thinking big-picture, and communicating business needs and technical processes.
                </p>
                <p>
                  I've always worn many hats at work, and thrive on a good dabble in the random. You'll find me
                  writing code every day. For the rest of what I do, hit the links below.
                </p>
                <div className='about-me-links'>
                  {this.ChevronLink('showArticles', 'Tech Blog')}
                  {this.ChevronLink('showPhotography', 'Photography')}
                  {this.ChevronLink('showMiscellaneous', 'Etc')}
                </div>
              </div>
              <div className="col-6">
                <span className="image fit"><img src={me} alt="Amber near Dresden, Germany"/></span>
              </div>
            </div>
          </section>
          {showArticles && <ArticlesSection />}
          {showPhotography && <Photography/>}
          {showMiscellaneous && <Miscellaneous/>}
        </div>
      </Layout>
    )
  }
}

export default IndexPage
