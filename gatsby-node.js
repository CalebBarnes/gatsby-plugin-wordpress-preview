const { resolve } = require(`path`);
const path = require(`path`);
const glob = require(`glob`);

const helpers = require(`gatsby-source-wordpress-experimental/steps/source-nodes/helpers`);

exports.createPages = async (
  { actions, graphql, reporter },
  {
    graphqlEndpoint,
    debug = false,
    excludedTemplates = [],
    templatesPath = `./src/templates/**/*.js`,
    contentTypeTemplateDirectory = `./src/templates/single/`,
  } // pluginOptions
) => {
  const getTemplates = () => {
    const sitePath = path.resolve(`./`);
    return glob.sync(templatesPath, { cwd: sitePath });
  };

  const templates = getTemplates();

  const {
    data: {
      wp: { generalSettings },
      allWpContentType: { nodes: contentTypes },
    },
  } = await graphql(/* GraphQL */ `
    query ALL_CONTENT_NODES {
      wp {
        generalSettings {
          url
        }
      }

      allWpContentType(filter: { graphqlSingleName: { ne: "mediaItem" } }) {
        nodes {
          graphqlSingleName
        }
      }
    }
  `);

  const contentTypeTemplates = templates.filter((path) =>
    path.includes(contentTypeTemplateDirectory)
  );

  await Promise.all(
    contentTypes.map(async (node, i) => {
      const { graphqlSingleName } = node;

      if (excludedTemplates.includes(graphqlSingleName)) {
        debug &&
          console.log(
            `${graphqlSingleName} is excluded. Not creating preview page.`
          );
      } else {
        const nodeTypeName = `${graphqlSingleName
          .charAt(0)
          .toUpperCase()}${graphqlSingleName.slice(1)}`;

        // dummy data to use while creating the preview template pages
        // this should prevent errors while destructuring data in page templates
        const { data: dummyData } = await graphql(/* GraphQL */ `
        {
          wp${nodeTypeName} {
            id
          }
        }
      `);

        console.log(`dummyData`);
        console.log(dummyData[`wp${nodeTypeName}`]);

        const templatePath = `${contentTypeTemplateDirectory}${graphqlSingleName}.js`;

        const contentTypeTemplate = contentTypeTemplates.find(
          (path) => path === templatePath
        );

        if (!contentTypeTemplate) {
          reporter.log(``);
          reporter.log(``);
          reporter.panic(
            `[gatsby-plugin-wordpress-preview] No template found at ${templatePath}\nfor single ${graphqlSingleName}
          \n\nAvailable templates:\n${contentTypeTemplates.join(`\n`)}`
          );
        }

        // todo: add support for custom templates and archive pages

        const { nodeQuery: query } =
          helpers.getQueryInfoBySingleFieldName(graphqlSingleName) || {};

        debug && console.log({ query });

        actions.createPage({
          component: resolve(contentTypeTemplate),
          path: `/preview/types/${graphqlSingleName}`,
          context: {
            graphqlEndpoint:
              graphqlEndpoint || `${generalSettings.url}/graphql`,
            preview: true,
            id: dummyData[`wp${nodeTypeName}`].id,
            query,
          },
        });
      }
    })
  );
};
