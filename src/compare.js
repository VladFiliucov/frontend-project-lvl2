import _ from 'lodash';

const compare = (oldConfig, newConfig) => {
  const innerCompare = (beforeConfig, afterConfig) => {
    const allKeys = _.union(Object.keys(beforeConfig), Object.keys(afterConfig));

    const nodes = allKeys.map(key => {
      if (_.has(beforeConfig, key) && !_.has(afterConfig, key)) {
        return {
          key,
          type: 'removal',
          data: beforeConfig[key],
        };
      }

      if (!_.has(beforeConfig, key) && _.has(afterConfig, key)) {
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
          children: innerCompare(beforeConfig[key], afterConfig[key]),
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

      if (_.isEqual(beforeConfig[key], afterConfig[key])) {
        return {
          key,
          type: 'persisted',
          data: beforeConfig[key],
        };
      }

      throw new Error("Couldn't compare properties ", beforeConfig[key], afterConfig[key]);
    });

    return nodes;
  };

  return innerCompare(oldConfig, newConfig);
};

export default compare;
