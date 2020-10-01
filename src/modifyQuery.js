import gql from "graphql-tag";
import iterate from "./iterate";
const { print } = require("graphql/language/printer");

export default function modifyQuery(query) {
  // this adds __typename to all items that don't have it
  // we need this to determine the type before we process the data
  const queryDocument = gql(query);

  iterate(queryDocument, (item, key) => {
    if (key === "selectionSet") {
      const selectionSet = item[key];

      let typenameExists = false;

      selectionSet?.selections &&
        selectionSet.selections.forEach((item) => {
          if (item?.name?.value === "__typename") {
            typenameExists = true;
          }
        });

      if (!typenameExists && selectionSet?.selections) {
        selectionSet.selections.push({
          alias: undefined,
          arguments: [],
          directives: [],
          kind: "Field",
          name: { kind: "Name", value: "__typename" },
        });
      }
    }
  });

  const newQuery = print(queryDocument);
  // console.log(newQuery);
  return newQuery;
}
