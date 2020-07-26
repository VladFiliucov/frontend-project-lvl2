import _ from 'lodash';

const normalizeChildren = (entry, nestingLevel, modification) => {
  const result = [];

  _.isPlainObject(entry) &&
    Object.entries(entry).forEach(([key, value]) => {
      // console.log([key, value]);
      const tempData = {};
      tempData.keyName = key;

      switch (typeof value) {
        case 'object':
          tempData.type = 'object';
          tempData.modification = modification;
          tempData.depth = nestingLevel;
          tempData.children = normalizeChildren(value, nestingLevel + 1, modification);
          break;
        default:
          tempData.type = 'primitive';
          tempData.modification = modification;
          tempData.data = value;
          tempData.depth = nestingLevel;
      }

      result.push(tempData);
    });
  return result;
};

const compare = (beforeConfig, afterConfig) => {
  const innerCompare = (nestedData, nestingLevel = 1) => {
    const [nestedBefore, nestedAfter] = nestedData;
    const result = [];

    Object.entries(nestedBefore).forEach(([key, value]) => {
      const tempData = {};
      tempData.keyName = key;
      const modifiedEntry = {};

      switch (typeof value) {
        case 'object':
          // TODO array, null and function are also type of object. Have to handle if they are supported
          tempData.type = 'object';
          tempData.depth = nestingLevel;
          if (_.has(nestedAfter, key)) {
            tempData.modification = 'keep';
            tempData.children = innerCompare([value, nestedAfter[key]], nestingLevel + 1);
          } else {
            tempData.modification = 'remove';
            tempData.depth = nestingLevel;
            tempData.children = normalizeChildren(value, nestingLevel + 1, 'keep');
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
          // TODO can't compare objects this way. Use lodash instead
          if (_.has(nestedAfter, key) && value !== nestedAfter[key]) {
            tempData.modification = 'remove';
            modifiedEntry.keyName = key;
            modifiedEntry.modification = 'add';
            modifiedEntry.depth = nestingLevel;
            if (typeof nestedAfter[key] === 'object') {
              modifiedEntry.type = 'object';
              // TODO Bug in next line
              modifiedEntry.children = normalizeChildren(
                nestedAfter[key],
                nestingLevel + 1,
                'keep',
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
      if (typeof nestedAfter[key] === 'object') {
        result.push({
          keyName: key,
          modification: 'add',
          depth: nestingLevel,
          type: 'object',
          children: normalizeChildren(nestedAfter[key], nestingLevel + 1, 'keep'),
        });
      } else {
        result.push({
          keyName: key,
          modification: 'add',
          data: nestedAfter[key],
          depth: nestingLevel,
          type: 'primitive',
        });
      }
    });

    return result;
  };

  const somet = innerCompare([beforeConfig, afterConfig]);
  // somet.flatMap(x => console.log(x))
  return somet;
};

export default compare;
