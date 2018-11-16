import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link';

import Photography from '../components/Photography'
import me from '../assets/images/main/me.png'
import Miscellaneous from '../components/Miscellaneous'

class Homepage extends React.Component {
  state = {}

  ChevronLink = ( toggle, text ) =>
    <a style={{ cursor: 'pointer' }}
       className={this.state[toggle] ? 'chevron-below' : ''}
       onClick={() => this.setState({
         showPhotography: false,
         showMiscellaneous: false,
         [toggle]: !this.state[toggle],
       })}>
      {text}
    </a>

  render() {
    const { showMiscellaneous, showPhotography } = this.state

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8"/>
          <title>Amber Wilkie</title>
        </Helmet>

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
                {this.ChevronLink('showPhotography', 'Photography')}
                {this.ChevronLink('showMiscellaneous', 'Etc')}
                <Link to='/blog'>Blog</Link>
              </div>
            </div>
            <div className="col-6">
              <span className="image fit"><img src={me} alt=""/></span>
            </div>
          </div>
        </section>
        {showPhotography && <Photography data={this.props.data}/>}
        {showMiscellaneous && <Miscellaneous/>}
      </div>
    )
  }
}

Homepage.propTypes = {
  route: React.PropTypes.object,
}

export default Homepage
