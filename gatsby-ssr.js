import Preview from "./src/Preview";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  const { pageContext } = props;

  if (!!pageContext.preview) {
    return <Preview pageProps={props} element={element} placeholder />;
  } else {
    return element;
  }
};
