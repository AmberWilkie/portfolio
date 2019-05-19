import React from 'react'
import '../assets/scss/main.scss'
import Footer from '../components/Footer'
import { Link } from 'gatsby'

class ArticleTemplate extends React.Component {
  render() {
    return (
      <div id='footer'>
        <div className='back-link'><Link to='/'>{'<< Home'}</Link></div>
        <div className='article-body'>
          <div className='article-inner'>
            {this.props.children}
          </div>
          <Footer/>
        </div>
      </div>
    )
  }
}

export default ArticleTemplate
