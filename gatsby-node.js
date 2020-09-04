const { resolve } = require(`path`);
const path = require(`path`);
const glob = require(`glob`);

const helpers = require(`gatsby-source-wordpress-experimental/steps/source-nodes/helpers`);

const getTemplates = () => {
  const sitePath = path.resolve(`./`);
  return glob.sync(`./src/templates/**/*.js`, { cwd: sitePath });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const templates = getTemplates();

  const {
    data: {
      wp: { generalSettings },
      allWpContentNode: { nodes: contentNodes },
    },
  } = await graphql(/* GraphQL */ `
    query ALL_CONTENT_NODES {
      wp {
        generalSettings {
          title
          url
        }
      }
      allWpContentNode(
        sort: { fields: modifiedGmt, order: DESC }
        filter: { nodeType: { ne: "MediaItem" } }
      ) {
        nodes {
          nodeType
          uri
          id
        }
      }
    }
  `);

  const contentTypeTemplateDirectory = `./src/templates/single/`;
  const contentTypeTemplates = templates.filter((path) =>
    path.includes(contentTypeTemplateDirectory)
  );

  await Promise.all(
    contentNodes.map(async (node, i) => {
      const { nodeType, uri, id } = node;

      const templatePath = `${contentTypeTemplateDirectory}${nodeType}.js`;

      const contentTypeTemplate = contentTypeTemplates.find(
        (path) => path === templatePath
      );

      if (!contentTypeTemplate) {
        dd(node);
        reporter.log(``);
        reporter.log(``);
        reporter.panic(
          `[using-gatsby-source-wordpress] No template found at ${templatePath}\nfor single ${nodeType} ${
            node.id
          } with path ${
            node.uri
          }\n\nAvailable templates:\n${contentTypeTemplates.join(`\n`)}`
        );
      }

      //   await actions.createPage({
      //     component: resolve(contentTypeTemplate),
      //     path: uri,
      //     context: {
      //       id,
      //       nextPage: (contentNodes[i + 1] || {}).id,
      //       previousPage: (contentNodes[i - 1] || {}).id,
      //     },
      //   });

      const { nodeQuery: query } =
        helpers.getQueryInfoBySingleFieldName(nodeType.toLowerCase()) || {};

      const { data: previewData } = await graphql(/* GraphQL */ `
      query {
        wp${nodeType} {
          id
          databaseId
        }
      }
    `);

      actions.createPage({
        component: resolve(contentTypeTemplate),
        path: `/preview/types/${nodeType.toLowerCase()}`,
        context: {
          wpUrl: generalSettings.url,
          preview: true,
          id: previewData[`wp${nodeType}`].id,
          query,
        },
      });
    })
  );
};
