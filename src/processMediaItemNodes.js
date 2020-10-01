import iterate from "./iterate";

export default function processMediaItemNodes(data) {
  iterate(data, (obj, key) => {
    if (
      key === "sourceUrl" &&
      obj[key].startsWith("http") &&
      obj.__typename === "MediaItem"
    ) {
      const localFile = {
        childImageSharp: {
          fluid: {
            aspectRatio: 1,
            base64: "",
            sizes: "",
            src: obj[key],
            srcSet: "",
          },
          fixed: {
            aspectRatio: 1,
            base64: "",
            sizes: "",
            src: obj[key],
            srcSet: "",
          },
        },
      };

      obj.localFile = localFile;
      obj.remoteFile = localFile;
    }
  });

  return data;
}
