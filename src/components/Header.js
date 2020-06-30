import React from 'react'
import HeaderImage from './HeaderImage'

class Header extends React.Component {
  render() {
    return (
      <section id="header">
        <HeaderImage />
        <div className="inner">
          <h1 className='header'>YO, I'M AMBER.</h1>
          <div style={{ display: 'flex' }}>
            <p style={{ width: '25%' }}/>
            <p style={{ flex: 1 }}>I'm a software engineer specializing in rapid prototypes
              for the web with Ruby and Javascript.</p>
            <p style={{ width: '25%' }}/>

          </div>
        </div>
      </section>
    )
  }
}

export default Header
