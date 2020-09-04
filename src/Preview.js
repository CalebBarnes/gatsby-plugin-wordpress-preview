import React from "react"
import styled from "styled-components"
import { BounceLoader } from "react-spinners"

import useQuery from "./useQuery"

export default (props) => {
  const { element, pageProps } = props
  const { pageContext } = pageProps

  const params = new URLSearchParams(pageProps?.location?.search)
  const postId = params.get("id")
  const jwtAuthKey = params.get("key")

  const { wpUrl, id, query } = pageContext || {}
  // console.log({ id })
  // console.log({ postId })
  // console.log({ jwtAuthKey })

  // console.log({ query })

  const [executeQuery, { error, data, called, loading }] = useQuery({
    // url: `${wpUrl}/graphql`,
    url: `${
      process.env.GATSBY_WPGRAPHQL_URL ||
      `https://wpgatsbydemo1.wpengine.com/graphql`
    }`,
    variables: { id: postId },
    query,
    headers: { Authorization: `Bearer ${jwtAuthKey}` },
  })

  !called && executeQuery()

  console.log({ data })

  if (loading) {
    return (
      <LoaderContainer>
        <BounceLoader />
      </LoaderContainer>
    )
  } else {
    return React.Children.map(element, (child) =>
      React.cloneElement(child, { data: data?.data })
    )
  }
}

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
