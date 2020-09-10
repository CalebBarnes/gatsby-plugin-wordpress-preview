import React from "react";
import styled from "styled-components";
import { BounceLoader } from "react-spinners";

import useQuery from "./useQuery";

export default (props) => {
  const { element, pageProps } = props;
  const { pageContext } = pageProps;

  const params = new URLSearchParams(pageProps?.location?.search);
  const postId = params.get("id");
  const jwtAuthKey = params.get("key");

  const { graphqlEndpoint, id, query } = pageContext || {};

  const [executeQuery, { error, data, called, loading }] = useQuery({
    url: graphqlEndpoint,
    variables: { id: postId },
    query,
    headers: { Authorization: `Bearer ${jwtAuthKey}` },
  });

  !called && executeQuery();

  console.log({ pageContext });
  console.log({ error, data, called, loading });

  if (loading) {
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
        <div>{error?.errors && error?.errors.map((item) => item.message)}</div>
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
