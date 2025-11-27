import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

/*
 * This component uses `gatsby-plugin-image` to serve optimized images with
 * lazy loading and modern formats. The image is loaded using a `StaticQuery`,
 * which allows us to load the image directly within this component instead of
 * passing the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-plugin-image`: https://www.gatsbyjs.com/plugins/gatsby-plugin-image/
 * - `StaticQuery`: https://www.gatsbyjs.com/docs/use-static-query/
 */

const HeaderImage = () => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "main/desert-min.jpg" }) {
          childImageSharp {
            gatsbyImageData(width: 1500, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    `}
    render={data => {
      const imageData = getImage(data.placeholderImage.childImageSharp)
      return (
        <GatsbyImage
          image={imageData}
          alt="Header"
          style={{
            maxHeight: '0px',
            position: 'unset'
          }}
          imgStyle={{
            objectPosition: '25% 25%',
          }}
        />
      )
    }}
  />
)
export default HeaderImage
