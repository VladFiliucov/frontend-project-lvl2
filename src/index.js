import { readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import chooseParser from './parsers.js';

const formatter = {
  add: (key, value) => `  + ${key}: ${value}`,
  remove: (key, value) => `  - ${key}: ${value}`,
  keep: (key, value) => `    ${key}: ${value}`,
};

export default (filepath1, filepath2) => {
  const firstFileParser = chooseParser(filepath1);
  const secondFileParser = chooseParser(filepath2);
  const firstFileContent = readFileSync(path.resolve(filepath1), 'utf8');
  const secondFileContent = readFileSync(path.resolve(filepath2), 'utf8');
  const beforeConfig = firstFileParser(firstFileContent);
  const afterConfig = secondFileParser(secondFileContent);

  const result = ['{'];

  Object.entries(beforeConfig).forEach(([key, value]) => {
    const isSame = value === afterConfig[key];

    if (isSame) {
      result.push(formatter.keep(key, value));
    } else {
      result.push(formatter.remove(key, value));

      if (_.has(afterConfig, key)) {
        result.push(formatter.add(key, afterConfig[key]));
      }
    }
  });
  const addedKeys = _.difference(Object.keys(afterConfig), Object.keys(beforeConfig));
  addedKeys.forEach(key => result.push(formatter.add(key, afterConfig[key])));
  result.push('}');
  const multilineDiff = result.join('\n');

  return multilineDiff;
};
