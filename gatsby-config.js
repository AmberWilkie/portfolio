module.exports = {
  siteMetadata: {
    siteUrl: `https://wilkie.tech`,
    title: 'Amber Wilkie, kick-ass software engineer',
    description:
      'Portfolio for Amber Wilkie, who specializes in rapid development for the web with Ruby and Javascript technologies',
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/src/articles`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 970,
            },
          },
        ],
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Amber Wilkie Portfolio',
        short_name: 'Amber',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/favicon.png',
      },
    },
    `gatsby-plugin-offline`,
  ],
}
