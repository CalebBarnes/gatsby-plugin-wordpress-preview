# gatsby-plugin-wordpress-preview

Requirements
- [https://github.com/gatsbyjs/gatsby-source-wordpress-experimental](gatsby-source-wordpress-experimental) 
- [https://github.com/CalebBarnes/WPGraphQL-Gatsby-Preview](WPGraphQL-Gatsby-Preview)


gatsby-config.js - default options
```
  {
    resolve: `gatsby-plugin-wordpress-preview`,
    options: {
      templatesPath: `./src/templates/**/*.js`,
      contentTypeTemplateDirectory: `./src/templates/single`,
    },
  },

```
