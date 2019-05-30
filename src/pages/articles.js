import React from 'react'
import ArticlesSection from '../components/ArticlesSection'
import Footer from '../components/Footer'

class Articles extends React.Component {
  render() {
    return (
      <div>
        <section id="articles">
          <ArticlesSection standalonePage={true}/>
        </section>
        <section id="footer">
          <Footer/>
        </section>
      </div>
    )
  }
}

export default Articles
