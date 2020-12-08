import _ from 'lodash';

const compare = (beforeConfig, afterConfig) => {
  const allKeys = _.union(Object.keys(beforeConfig), Object.keys(afterConfig));

  const nodes = allKeys.map(key => {
    if (!_.has(afterConfig, key)) {
      return {
        key,
        type: 'removal',
        data: beforeConfig[key],
      };
    }

    if (!_.has(beforeConfig, key)) {
      return {
        key,
        type: 'addition',
        data: afterConfig[key],
      };
    }

    if (_.isPlainObject(beforeConfig[key]) && _.isPlainObject(afterConfig[key])) {
      return {
        key,
        type: 'parent',
        children: compare(beforeConfig[key], afterConfig[key]),
      };
    }

    if (!_.isEqual(beforeConfig[key], afterConfig[key])) {
      return {
        key,
        type: 'modified',
        removedData: beforeConfig[key],
        addedData: afterConfig[key],
      };
    }

    return {
      key,
      type: 'persisted',
      data: beforeConfig[key],
    };
  });

  return nodes;
};

export default compare;
