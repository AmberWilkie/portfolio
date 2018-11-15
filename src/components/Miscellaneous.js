import React, { Component } from 'react'
import { miscellaneousTexts as texts } from '../utilities/constants'

class Miscellaneous extends Component {
  state = { current: 'intro' }

  render() {
    const { current } = this.state

    const TextSection = () => (
      <div className="col-6">
        <header className="major">
          <h2>{texts[current].header}</h2>
        </header>
        <p>{texts[current].p1}</p>
        {texts[current].links && (<p>
          {texts[current].links.map(link => (
            <a href={link.href} key={link.href} className='miscellaneous' target='_new'>{link.text}</a>
          ))}
        </p>)}
      </div>
    )

    return (
      <section id="two" className="main style2">
        <div className="grid-wrapper">
          <div className="col-6">
            <ul className="major-icons">
              <li><span className="icon style1 major cursor fa-th"
                        onClick={() => this.setState({ current: 'slides' })}/></li>
              <li><span className="icon style4 major cursor fa-american-sign-language-interpreting"
                        onClick={() => this.setState({ current: 'yoga' })}/></li>
              <li><span className="icon style2 major cursor fa-file-text-o"
                        onClick={() => this.setState({ current: 'cv' })}/></li>
              <li><span className="icon style5 major cursor fa-map"
                        onClick={() => this.setState({ current: 'location' })}/></li>
            </ul>
          </div>
          {TextSection()}
        </div>
      </section>
    )
  }
}

Miscellaneous.propTypes = {}

export default Miscellaneous
