import iterate from "./iterate";

export default function processMediaItemNodes(data) {
  iterate(data, (obj, key) => {
    if (
      key === "sourceUrl" &&
      obj &&
      obj[key] &&
      obj[key].startsWith("http") &&
      obj.__typename === "MediaItem"
    ) {
      const { mediaType, mediaDetails, srcSet } = obj;

      if (mediaType === "image") {
        const { width, height } = mediaDetails;
        const aspectRatio = width / height;

        const localFile = {
          childImageSharp: {
            fluid: {
              aspectRatio,
              base64: "",
              sizes: "",
              src: obj[key],
              srcSet,
            },
          },
        };

        obj.localFile = localFile;
        obj.remoteFile = localFile;
      }
    }
  });

  return data;
}
