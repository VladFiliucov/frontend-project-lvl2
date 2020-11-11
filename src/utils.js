// NOTE: might not work in IE. Should be good in Node
function isObject(obj) {
  return obj != null && obj.constructor.name === 'Object';
}

export default isObject;
