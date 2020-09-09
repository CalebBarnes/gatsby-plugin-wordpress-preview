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

  const { wpUrl, id, query } = pageContext || {};

  const [executeQuery, { error, data, called, loading }] = useQuery({
    url: `${process.env.GATSBY_WPGRAPHQL_URL || `${wpUrl}/graphql`}`,
    variables: { id: postId },
    query,
    headers: { Authorization: `Bearer ${jwtAuthKey}` },
  });

  !called && executeQuery();

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
      <LoaderContainer>Something went wrong. Please try again.</LoaderContainer>
    );
  } else {
    return null;
  }
};

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
