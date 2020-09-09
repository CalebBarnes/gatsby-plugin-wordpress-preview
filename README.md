# gatsby-plugin-wordpress-preview

Requirements

- [https://github.com/gatsbyjs/gatsby-source-wordpress-experimental](gatsby-source-wordpress-experimental)
- [https://github.com/CalebBarnes/WPGraphQL-Gatsby-Preview](WPGraphQL-Gatsby-Preview)

gatsby-config.js

```
  {
    resolve: `gatsby-plugin-wordpress-preview`,
    options: {
      debug: true, // shows extra console logs. defaults to false
      excludedTemplates: ["post"], // exclude templates by their graphqlSingleName. defaults to nothing
      templatesPath: `./src/templates/**/*.js`, // default
      contentTypeTemplateDirectory: `./src/templates/single`, // default
    },
  },

```
