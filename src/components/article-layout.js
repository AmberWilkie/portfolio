import React from 'react'
import '../assets/scss/main.scss'
import Footer from '../components/Footer'

class ArticleTemplate extends React.Component {
  render() {
    return (
      <div id='footer' className='article-body'>
        <div className='article-inner'>
          {this.props.children}
        </div>
        <Footer/>
      </div>
    )
  }
}

export default ArticleTemplate
