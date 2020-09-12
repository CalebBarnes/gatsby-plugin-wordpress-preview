import React from "react";
import { BounceLoader } from "react-spinners";

import useQuery from "./useQuery";

export const Preview = (props) => {
  const { element, pageProps } = props;
  const { pageContext } = pageProps;

  const params = new URLSearchParams(pageProps?.location?.search);
  const postId = params.get("id");
  const jwtAuthKey = params.get("key");

  const { graphqlEndpoint, query, debug } = pageContext || {};

  const [executeQuery, { error, data, called, loading }] = useQuery({
    url: graphqlEndpoint,
    variables: { id: postId },
    query,
    headers: { Authorization: `Bearer ${jwtAuthKey}` },
  });

  !called && executeQuery();

  debug && console.log("Preview.js", { postId, jwtAuthKey });
  debug && console.log("Preview.js", { postId, jwtAuthKey });
  debug && console.log("Preview.js", { error, data, called, loading });

  if (loading || typeof window === `undefined`) {
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
        <div>Something went wrong. Please try again.</div>
        <div>{error?.errors && error.errors.map(({ message }) => message)}</div>
      </LoaderContainer>
    );
  } else {
    return null;
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
