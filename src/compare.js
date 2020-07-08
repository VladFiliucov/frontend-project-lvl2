import _ from 'lodash';

const formatter = {
  add: (key, value, ofset = 2) => `${' '.repeat(ofset)}+ ${key}: ${value}`,
  remove: (key, value, ofset = 2) => `${' '.repeat(ofset)}- ${key}: ${value}`,
  keep: (key, value, ofset = 4) => `${' '.repeat(ofset)}${key}: ${value}`,
};

const unfoldModifiedObject = (entry, nestingLevel) => {
  const tempData = {};

  Object.entries(entry).forEach(([key, value]) => {
    tempData.keyName = key;

    switch (typeof value) {
      case 'object':
        tempData.type = 'object';
        tempData.modification = 'keep';
        tempData.depth = nestingLevel;
        tempData.data = unfoldModifiedObject(value, nestingLevel + 1);
        break;
      default:
        tempData.type = 'primitive';
        tempData.modification = 'keep';
        tempData.data = value;
        tempData.depth = nestingLevel;
    }
  })
  return tempData;
}

const compare = (beforeConfig, afterConfig) => {
  // {keyName: 'bar', type: 'primitive', data: 'foo', depth: 0, path: 'bar', modification: 'add'},

  const innerCompare = (nestedBefore, nestedAfter, nestingLevel = 1, path = []) => {
    const result = {};
        console.log(nestedBefore);
    // NESTED BEFORE may not be an object
    // so we need to handle primitives outside of that forEach loop

    Object.entries(nestedBefore).forEach(([key, value]) => {
      const tempData = {};
      tempData.keyName = key
      tempData.path = path.concat(key);

      switch (typeof value) {
        case 'object':
          // TODO array, null and function are also objects.
          tempData.type = 'object';
          if (_.has(nestedAfter, key)) {
            tempData.modification = 'keep';
            tempData.data = innerCompare(nestedBefore[key], nestedAfter[key], nestingLevel + 1, tempData.path);
          } else {
            tempData.modification = 'remove';
            tempData.depth = nestingLevel;
            tempData.data = unfoldModifiedObject(value, nestingLevel + 1);
          }
          break;
        default:
          tempData.type = 'primitive';
          tempData.data = value;
          tempData.depth = nestingLevel;
          if (_.has(nestedAfter, key) && (value === nestedAfter[key])) {
            tempData.modification = 'keep';
          } else {
            tempData.modification = 'add';
          }
      }
      _.set(result, [...tempData.path], tempData)
    });
    return result;
    // console.log(result);
  }

  const somet = innerCompare(beforeConfig, afterConfig);
  // console.log(somet);
}

export default compare;
