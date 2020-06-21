import _ from 'lodash';

const formatter = {
  add: (key, value) => `  + ${key}: ${value}`,
  remove: (key, value) => `  - ${key}: ${value}`,
  keep: (key, value) => `    ${key}: ${value}`,
};

export default (beforeConfig, afterConfig) => {
  const result = ['{'];

  for (let [key, value] of Object.entries(beforeConfig)) {
    const isSame = value === afterConfig[key];

    if (isSame) {
      result.push(formatter.keep(key, value));
    } else {
      result.push(formatter.remove(key, value));

      if (_.has(afterConfig, key)) {
        result.push(formatter.add(key, afterConfig[key]));
      }
    }
  }
  const addedKeys = _.difference(Object.keys(afterConfig), Object.keys(beforeConfig));
  addedKeys.forEach(key => result.push(formatter.add(key, afterConfig[key])));
  result.push('}');
  const multilineDiff = result.join('\n')

  return multilineDiff
};

