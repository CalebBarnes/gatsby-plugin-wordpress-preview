import { useState } from "react";

export const useQuery = ({
  url,
  variables,
  query,
  headers,
  onCompleted,
  onError,
}) => {
  const initialState = {
    loading: false,
    data: null,
    error: null,
    called: false,
  };

  const [state, setState] = useState(initialState);

  const callback = async () => {
    setState({
      ...state,
      called: true,
      loading: true,
      error: null,
    });

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.errors) {
          setState({
            ...state,
            loading: false,
            data: null,
            called: true,
            error: result,
          });

          onError && typeof onError === "function" && onCompleted(result); //optional callback function
        } else {
          setState({
            ...state,
            loading: false,
            data: result,
            called: true,
            error: null,
          });

          onCompleted &&
            typeof onCompleted === "function" &&
            onCompleted(result); //optional callback function
        }
      })
      .catch((error) => {
        console.log("error", { error });

        setState({ ...state, error, loading: false, called: true });

        onError && typeof onError === "function" && onError(error); //optional callback function
      });
  };

  return [callback, state];
};

export default useQuery;
