import _ from 'lodash';

const normalizeChildren = (entry, nestingLevel, modification, pathToProperty) => {
  const result = [];

  if (_.isPlainObject(entry)) {
    Object.entries(entry).forEach(([key, value]) => {
      const tempData = {};
      tempData.keyName = key;
      tempData.path = `${pathToProperty}.${key}`;

      switch (typeof value) {
        case 'object':
          tempData.type = 'object';
          tempData.modification = modification;
          tempData.depth = nestingLevel;
          tempData.children = normalizeChildren(
            value,
            nestingLevel + 1,
            modification,
            tempData.path,
          );
          break;
        default:
          tempData.type = 'primitive';
          tempData.modification = modification;
          tempData.data = value;
          tempData.depth = nestingLevel;
      }

      result.push(tempData);
    });
  }
  return result;
};

const compare = (beforeConfig, afterConfig) => {
  const innerCompare = (nestedData, nestingLevel = 1, pathToProperty = '') => {
    const [nestedBefore, nestedAfter] = nestedData;
    const result = [];

    Object.entries(nestedBefore).forEach(([key, value]) => {
      const tempData = {};
      tempData.keyName = key;
      const extendedPath = pathToProperty === '' ? key : `.${key}`;
      tempData.path = `${pathToProperty}${extendedPath}`;
      const modifiedEntry = {};

      switch (typeof value) {
        case 'object':
          // TODO array, null and function are also type of object. Have to handle if they are supported in requirements
          tempData.type = 'object';
          tempData.depth = nestingLevel;
          if (_.has(nestedAfter, key)) {
            tempData.modification = 'keep';
            tempData.children = innerCompare(
              [value, nestedAfter[key]],
              nestingLevel + 1,
              tempData.path,
            );
          } else {
            tempData.modification = 'remove';
            tempData.depth = nestingLevel;
            tempData.children = normalizeChildren(value, nestingLevel + 1, 'keep', tempData.path);
          }
          break;
        default:
          tempData.type = 'primitive';
          tempData.data = value;
          tempData.depth = nestingLevel;
          if (_.has(nestedAfter, key) && value === nestedAfter[key]) {
            tempData.modification = 'keep';
          }
          if (!_.has(nestedAfter, key)) {
            tempData.modification = 'remove';
          }
          if (_.has(nestedAfter, key) && value !== nestedAfter[key]) {
            tempData.modification = 'remove';
            modifiedEntry.keyName = key;
            modifiedEntry.modification = 'add';
            modifiedEntry.depth = nestingLevel;
            modifiedEntry.path = tempData.path;
            if (typeof nestedAfter[key] === 'object') {
              modifiedEntry.type = 'object';
              modifiedEntry.children = normalizeChildren(
                nestedAfter[key],
                nestingLevel + 1,
                'keep',
                tempData.path,
              );
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

    const addedKeys = _.difference(Object.keys(nestedAfter), Object.keys(nestedBefore));
    addedKeys.forEach(key => {
      const extendedPath = pathToProperty === '' ? key : `${pathToProperty}.${key}`;

      if (typeof nestedAfter[key] === 'object') {
        result.push({
          keyName: key,
          modification: 'add',
          depth: nestingLevel,
          path: extendedPath,
          type: 'object',
          children: normalizeChildren(nestedAfter[key], nestingLevel + 1, 'keep', extendedPath),
        });
      } else {
        result.push({
          keyName: key,
          path: extendedPath,
          modification: 'add',
          data: nestedAfter[key],
          depth: nestingLevel,
          type: 'primitive',
        });
      }
    });

    return result;
  };

  return innerCompare([beforeConfig, afterConfig]);
};

export default compare;
