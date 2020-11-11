import _ from 'lodash';

// NOTE: might not work in IE. Should be good in Node
function isObject(obj) {
  return obj != null && obj.constructor.name === 'Object';
}

const compare = (oldConfig, newConfig) => {
  const innerCompare = (beforeConfig, afterConfig, nestingLevel = 1) => {
    const beforeKeys = Object.keys(beforeConfig);
    const afterKeys = Object.keys(afterConfig);
    const allKeys = [...new Set([...beforeKeys, ...afterKeys])];

    const nodes = allKeys.map(key => {
      if (_.has(beforeConfig, key) && !_.has(afterConfig, key)) {
        return {
          key,
          nestingLevel,
          type: 'remove',
          data: beforeConfig[key],
        };
      }

      if (!_.has(beforeConfig, key) && _.has(afterConfig, key)) {
        return {
          key,
          nestingLevel,
          type: 'add',
          data: afterConfig[key],
        };
      }

      if (isObject(beforeConfig[key]) && isObject(afterConfig[key])) {
        return {
          key,
          nestingLevel,
          type: 'parent',
          children: innerCompare(beforeConfig[key], afterConfig[key], nestingLevel + 1),
        };
      }

      if (
        _.has(beforeConfig, key) &&
        _.has(afterConfig, key) &&
        beforeConfig[key] !== afterConfig[key]
      ) {
        return {
          key,
          nestingLevel,
          type: 'modified',
          removedData: beforeConfig[key],
          addedData: afterConfig[key],
        };
      }

      if (
        _.has(beforeConfig, key) &&
        _.has(afterConfig, key) &&
        beforeConfig[key] === afterConfig[key]
      ) {
        return {
          key,
          nestingLevel,
          type: 'keep',
          data: beforeConfig[key],
        };
      }

      throw new Error('something went wrong');
    });

    return nodes;
  };

  return innerCompare(oldConfig, newConfig);
};

export default compare;
