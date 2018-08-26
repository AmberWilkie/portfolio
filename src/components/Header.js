import React from 'react'

class Header extends React.Component {
  render() {
    return (
      <section id="header">
        <div className="inner">
          <h1 className='header'>YO, I'M AMBER.</h1>
          <p>I'm a freelance software engineer specializing in rapid prototypes for the web.<br />
          It's awesome.</p>
          <ul className="actions">
            <li><a href="#one" className="button scrolly">About Me</a></li>
            <li><a href="#one" className="button scrolly">Photography</a></li>
          </ul>
        </div>
      </section>
    )
  }
}

export default Header
