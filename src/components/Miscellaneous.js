import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CV from '../assets/Wilkie_CV.pdf';

const texts = {
  intro: {
    header: 'Miscellaneous',
    p1: 'All the other bits that don\'t fit so easily into one category or the other.',
  },
  slides: {
    header: 'Slides from public speaking',
    p1: 'Sometimes I get up the nerve to give a talk. Here are some links to slides from talks I\'ve given',
    links: [{
      href: 'https://docs.google.com/presentation/d/e/2PACX-1vTRv9hDF3LjRb1_ryzwKx4QeXlyDgNwdVPpxmrCZ6w976kRsVeDCvj-kTnnPXzT_Q0W0tZ2eUajEfAU/pub?start=false&loop=false&delayms=3000',
      text: 'Rails and GraphQL, Got.rb meetup, September 2018',
    },
      {
        href: 'https://docs.google.com/presentation/d/e/2PACX-1vTZf-tWeZpBVaCaHmS1m8GLt7tRje4FLy9C2LJCjv2-_QD47NgwQN-WGkN9wXiEDZpUhK1TMx_Hqgp1/pub?start=false&loop=false&delayms=3000',
        text: 'Rails is Awesome, Sigma Smart Women, December 2016',
      }],
  },
  yoga: {
    header: 'Yoga',
    p1: 'I have a yoga podcast because I love embarrassing myself. It\'s called \"Just Some Yoga\". Here\'s some links, but it\'s available wherever you look for it, probably.',
    links: [{
      href: 'https://itunes.apple.com/us/podcast/just-some-yoga/id1361270660?mt=2',
      text: 'Apple Podcasts',
    },
      {
        href: 'http://pca.st/l3Xh',
        text: 'Pocket Casts',
      }],
  },
  location: {
    header: 'Geolocating Me',
    p1: 'Until late December, I\'ll be living in Gothenburg, Sweden. We\'ve been here three years and it has been pleasant enough. January 1 my plane touches down in Amsterdam and there we\'ll stay for at least two years.',
  },
  cv: {
    header: 'CV',
    p1: 'What would a personal website be without a stodgy accounting of all the work-related things I\'ve ever done?',
    links: [{
      href: CV,
      text: 'Download CV',
    }],
  },
}

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
