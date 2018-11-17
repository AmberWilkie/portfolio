import React from 'react'
import '../assets/scss/main.scss'

import Header from '../components/Header'
import Footer from '../components/Footer'

class Template extends React.Component {
  render() {
    return (
      <div className='body'>
        <Header/>
        {this.props.children}
        <Footer/>
      </div>
    )
  }
}

export default Template;
