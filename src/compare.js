import _ from 'lodash';
import isObject from './utils.js';

const compare = (oldConfig, newConfig) => {
  const innerCompare = (beforeConfig, afterConfig, nestingLevel = 1) => {
    const allKeys = _.union(Object.keys(beforeConfig), Object.keys(afterConfig));

    const nodes = allKeys.map(key => {
      if (_.has(beforeConfig, key) && !_.has(afterConfig, key)) {
        return {
          key,
          nestingLevel,
          type: 'removal',
          data: beforeConfig[key],
        };
      }

      if (!_.has(beforeConfig, key) && _.has(afterConfig, key)) {
        return {
          key,
          nestingLevel,
          type: 'addition',
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
          type: 'persisted',
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
