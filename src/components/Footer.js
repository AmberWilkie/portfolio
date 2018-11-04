import React from 'react'

class Footer extends React.Component {
  render() {
    return (
      <section id="footer">
        <ul className="icons">
          <li><a href="https://twitter.com/heyamberwilkie" className="icon alt fa-twitter"><span
            className="label">Twitter</span></a></li>
          <li><a href="https://www.instagram.com/heyamberwilkie/" className="icon alt fa-instagram"><span
            className="label">Instagram</span></a></li>
          <li><a href="https://github.com/amberwilkie" className="icon alt fa-github"><span
            className="label">GitHub</span></a></li>
          <li><a href="https://www.linkedin.com/in/amber-wilkie/" className="icon alt fa-linkedin-square"><span
            className="label">GitHub</span></a></li>
        </ul>
      </section>
    )
  }
}

export default Footer
