import React from "react";
import { BounceLoader } from "react-spinners";

import useQuery from "./useQuery";
import modifyQuery from "./modifyQuery";
import processMediaItemNodes from "./processMediaItemNodes";

export const Preview = (props) => {
  const { element, pageProps, placeholder } = props;
  const { pageContext } = pageProps;

  const params = new URLSearchParams(pageProps?.location?.search);
  const postId = params.get("id");
  const jwtAuthKey = params.get("key");

  const { query, previewOptions } = pageContext || {};

  const debugLog = (message) => {
    previewOptions.debug &&
      console.log(`[gatsby-plugin-wordpress-preview] `, message);
  };

  const [executeQuery, { error, data, called, loading }] = useQuery({
    url: previewOptions.graphqlEndpoint,
    variables: { id: postId },
    query: previewOptions?.processMediaItems ? modifyQuery(query) : query,
    headers: { Authorization: `Bearer ${jwtAuthKey}` },
  });

  !called && executeQuery();

  debugLog({ postId, jwtAuthKey });
  debugLog({ previewOptions });

  debugLog({
    error,
    data,
    called,
    loading,
  });

  if (data && previewOptions?.processMediaItems) {
    processMediaItemNodes(data);
  }

  if (loading || placeholder || typeof window === `undefined`) {
    return (
      <LoaderContainer>
        <BounceLoader />
      </LoaderContainer>
    );
  } else if (data && !error) {
    return React.Children.map(element, (child) =>
      React.cloneElement(child, { data: data?.data })
    );
  } else if (error) {
    return (
      <LoaderContainer>
        <p>Something went wrong. Please try again.</p>
        <p>{error?.errors && error.errors.map(({ message }) => message)}</p>
      </LoaderContainer>
    );
  } else {
    return (
      <LoaderContainer>
        <p>Something went wrong. Please try again.</p>
        <p>{error?.errors && error.errors.map(({ message }) => message)}</p>
      </LoaderContainer>
    );
  }
};

const LoaderContainer = (props) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "80vh",
      "> div": {
        margin: "15px 0",
      },
    }}
    {...props}
  />
);

export default Preview;
