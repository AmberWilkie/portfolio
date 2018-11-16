import React from 'react'
import '../assets/scss/main.scss'

import Header from '../components/Header'
import Footer from '../components/Footer'

class Template extends React.Component {
  render() {
    return (
      <div className='body'>
        <Header/>
        {console.log('are we even trying this?')}
        {this.props.children}
        <Footer/>
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
}

export default Template
