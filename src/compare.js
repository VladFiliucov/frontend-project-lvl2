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
        tempData.children = unfoldModifiedObject(value, nestingLevel + 1);
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
  // {keyName: 'bar', type: 'primitive', data: 'foo', children: [], depth: 0, path: 'bar', modification: 'add'},

  const innerCompare = (nestedData, nestingLevel = 1) => {
    const [nestedBefore, nestedAfter] = nestedData;
    const result = []

    // NESTED BEFORE may not be an object
    // so we need to handle primitives outside of that forEach loop

    Object.entries(nestedBefore).forEach(([key, value]) => {
      const tempData = {};
      tempData.keyName = key
      const modifiedEntry = {};
      // tempData.path = path.concat(key);

      switch (typeof value) {
        case 'object':
          // TODO array, null and function are also type of object. Have to handle if they are supported
          tempData.type = 'object';
          if (_.has(nestedAfter, key)) {
            tempData.modification = 'keep';
            tempData.children = compare(value, nestedAfter.key);
          } else {
            tempData.modification = 'add';
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
          }
          if (!_.has(nestedAfter, key)) {
            tempData.modification = 'remove';
          }
          if (_.has(nestedAfter, key) && (value !== nestedAfter[key])) {
            tempData.modification = 'remove';
            modifiedEntry.keyName = key;
            modifiedEntry.modification = 'add';
            modifiedEntry.depth = nestingLevel;
            if (typeof nestedAfter[key] === 'object') {
              modifiedEntry.type = 'object';
              modifiedEntry.children =unfoldModifiedObject(nestedAfter[key], nestingLevel + 1)
            } else {
              modifiedEntry.type = 'primitive';
              modifiedEntry.data = nestedAfter[key];
            }
          }
      }
      result.push(tempData);
      if (modifiedEntry.keyName) {
        result.push(modifiedEntry);
      }
    });
    return result;
  }

  const somet = innerCompare([beforeConfig, afterConfig]);
  // somet.flatMap(x => console.log(x))
  return somet;
}

export default compare;
