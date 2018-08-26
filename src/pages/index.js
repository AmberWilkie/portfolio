import React from 'react'
import Helmet from 'react-helmet'

import me from '../assets/images/main/me.jpg'
import pic02 from '../assets/images/pic02.jpg'
import pic03 from '../assets/images/pic03.jpg'
import pic04 from '../assets/images/pic04.jpg'

class Homepage extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <div>
        <Helmet title={siteTitle}/>

        <section id="one" className="main style1">
          <div className="grid-wrapper">
            <div className="col-6">
              <header className="major">
                <h2>About Me</h2>
              </header>
              <p>Hi, it's me. I live in Gothenburg, Sweden and work for a great little startup connecting schools and substitute teachers.</p>
              <p>We work with React and Rails and get to do everything from brainstorm to pick the colors for buttons.</p>
            </div>
            <div className="col-6">
              <span className="image fit"><img src={me} alt=""/></span>
            </div>
          </div>
        </section>

        <section id="two" className="main style2">
          <div className="grid-wrapper">
            <div className="col-6">
              <ul className="major-icons">
                <li><span className="icon style1 major fa-code"></span></li>
                <li><span className="icon style2 major fa-bolt"></span></li>
                <li><span className="icon style3 major fa-camera-retro"></span></li>
                <li><span className="icon style4 major fa-cog"></span></li>
                <li><span className="icon style5 major fa-desktop"></span></li>
                <li><span className="icon style6 major fa-calendar"></span></li>
              </ul>
            </div>
            <div className="col-6">
              <header className="major">
                <h2>About me</h2>
              </header>
              <p>Yo! I’m Amber. I’m a Star-Trek-watching, thrift-store-shopping, belly-laughing, road-tripping,
                food-gobbling, photo-obsessed kinda girl. You could say I collect hobbies: ceramics, yoga, drawing,
                guitar (and so many more) . I spend an ungodly amount of time on the computer. If being a nerd is cool
                now, then I am super cool. I used to do wedding photography full-time and that was great.</p>
              <p>But then I
                thought: I'd really like to build web apps, so I went to bootcamp and now I do that for a living. Change
                is fun! I made this promotional video for my photography business and it's funny and weird and I'm just
                going to go ahead and keep on linking it (plus a bunch of wedding links because it was damn hard to earn
                those 30 five-star Yelp reviews! Did I ever get paid in Bitcoin? I did not.</p>
            </div>
          </div>
        </section>

        <section id="three" className="main style1 special">
          <div className="grid-wrapper">
            <div className="col-12">
              <header className="major">
                <h2>Adipiscing amet consequat</h2>
              </header>
              <p>Ante nunc accumsan et aclacus nascetur ac ante amet sapien sed.</p>
            </div>

            <div className="col-4">
              <span className="image fit"><img src={pic02} alt=""/></span>
              <h3>Magna feugiat lorem</h3>
              <p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat
                et nascetur.</p>
              <ul className="actions">
                <li><a href="#" className="button">More</a></li>
              </ul>
            </div>
            <div className="col-4">
              <span className="image fit"><img src={pic03} alt=""/></span>
              <h3>Magna feugiat lorem</h3>
              <p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat
                et nascetur.</p>
              <ul className="actions">
                <li><a href="#" className="button">More</a></li>
              </ul>
            </div>
            <div className="col-4">
              <span className="image fit"><img src={pic04} alt=""/></span>
              <h3>Magna feugiat lorem</h3>
              <p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat
                et nascetur.</p>
              <ul className="actions">
                <li><a href="#" className="button">More</a></li>
              </ul>
            </div>

          </div>
        </section>

        <section id="four" className="main style2 special">
          <div className="container">
            <header className="major">
              <h2>Ipsum feugiat consequat?</h2>
            </header>
            <p>Sed lacus nascetur ac ante amet sapien.</p>
            <ul className="actions uniform">
              <li><a href="#" className="button special">Sign Up</a></li>
              <li><a href="#" className="button">Learn More</a></li>
            </ul>
          </div>
        </section>
      </div>
    )
  }
}

Homepage.propTypes = {
  route: React.PropTypes.object,
}

export default Homepage

export const pageQuery = graphql`
    query IndexQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
`
