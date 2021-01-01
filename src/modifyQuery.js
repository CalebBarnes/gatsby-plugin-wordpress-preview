import gql from "graphql-tag";
const { print } = require("graphql/language/printer");

export default function modifyQuery(query) {
  function iterate(obj, callback) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object") {
          if (
            obj.typeCondition &&
            obj.typeCondition.name.value === "MediaItem"
          ) {
            // we shouldn't iterate this object because we added it! infinite loops are bad
          } else {
            iterate(obj[key], callback);
          }
        }

        if (callback && typeof callback === "function") {
          callback(obj, key);
        }
      }
    }
  }

  const mediaItemFragment = gql`
    {
      ... on MediaItem {
        mediaType
        srcSet
        mediaDetails {
          height
          width
        }
      }
    }
  `;

  const mediaItemFields =
    mediaItemFragment?.definitions?.[0]?.selectionSet?.selections?.[0];

  // this adds __typename and the MediaItem fragment to all fields with the 'sourceUrl' field
  // we need this to determine the type before we process the data
  const queryDocument = gql(query);

  iterate(queryDocument, (item, key) => {
    if (key === "selectionSet") {
      const selectionSet = item[key];

      const sourceUrlField =
        selectionSet &&
        selectionSet.selections &&
        selectionSet.selections.find(
          (item) => item && item.name && item.name.value === "sourceUrl"
        );

      let typenameExists = false;

      selectionSet?.selections &&
        selectionSet.selections.forEach((item) => {
          if (item?.name?.value === "__typename") {
            typenameExists = true;
          }
        });

      if (!typenameExists && sourceUrlField) {
        selectionSet.selections.push(
          {
            alias: undefined,
            arguments: [],
            directives: [],
            kind: "Field",
            name: { kind: "Name", value: "__typename" },
          },
          mediaItemFields
        );
      }
    }
  });

  const newQuery = print(queryDocument);

  return newQuery;
}
