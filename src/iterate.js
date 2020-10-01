// iterate through all properties in object and child objects
export default function iterate(obj, callback) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        iterate(obj[key], callback);
      }

      if (callback && typeof callback === "function") {
        callback(obj, key);
      }
    }
  }
}
