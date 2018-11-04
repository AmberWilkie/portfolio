import React from 'react'

class Footer extends React.Component {
  render() {
    return (
      <section id="footer">
        <div className='container'>
          <header className='major'>
            <h2>Should we be talking?</h2>
          </header>
          <ul className="icons">
            <li>amber@amberwilkie.com</li>
            <li className='icon alt fa-ellipsis-v'></li>
            <li><a href="https://twitter.com/heyamberwilkie" className="icon alt fa-twitter"><span
              className="label">Twitter</span></a></li>
            <li><a href="https://www.instagram.com/heyamberwilkie/" className="icon alt fa-instagram"><span
              className="label">Instagram</span></a></li>
            <li><a href="https://github.com/amberwilkie" className="icon alt fa-github"><span
              className="label">GitHub</span></a></li>
            <li><a href="https://www.linkedin.com/in/amber-wilkie/" className="icon alt fa-linkedin-square"><span
              className="label">GitHub</span></a></li>
          </ul>
          <ul className='actions uniform'>
            <li><a href='mailto:amber@amberwilkie.com' className='button special'>Drop me a line</a></li>
          </ul>
        </div>
      </section>
    )
  }
}

export default Footer
