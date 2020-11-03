export const forEach = (obj = {}, fn) => {
  Object.keys(obj).forEach(key => {
    obj[key] = fn(obj[key], key);
  });
};