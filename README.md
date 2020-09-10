# gatsby-plugin-wordpress-preview

Requirements

- https://github.com/gatsbyjs/gatsby-source-wordpress-experimental
- https://github.com/CalebBarnes/WPGraphQL-Gatsby-Preview

gatsby-config.js

```
  {
    resolve: `gatsby-plugin-wordpress-preview`,
    options: {
      graphqlEndpoint: "https://yoursite.com/graphql", // defaults to `${generalSettings.url}/graphql` from wordpress
      excludedTemplates: ["post"], // exclude templates by their graphqlSingleName. defaults to none
      debug: true, // shows extra console logs. defaults to false
      templatesPath: `./src/templates/**/*.js`, // default
      contentTypeTemplateDirectory: `./src/templates/single`, // default
    },
  },

```
