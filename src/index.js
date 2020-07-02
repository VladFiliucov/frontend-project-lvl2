import { readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import compare from './compare.js';
import chooseParser from './parsers.js';

const BASE_OFFSET = 2;

const formatter = {
  add: (key, value, ofset = 2) => `${' '.repeat(ofset)}+ ${key}: ${value}`,
  remove: (key, value, ofset = 2) => `${' '.repeat(ofset)}- ${key}: ${value}`,
  keep: (key, value, ofset = 4) => `${' '.repeat(ofset)}${key}: ${value}`,
};

const formatOutput = (entries, nestingLevel = 0) => {
  const start = `${' '.repeat(nestingLevel)}{`;
  const end = `${' '.repeat(nestingLevel)}}`;
  const indentedEntries = entries.map(entry => `${' '.repeat(nestingLevel)}${entry}`);
  const result = [start, ...indentedEntries, end];
  const multilineDiff = result.join('\n');

  return multilineDiff;
};

const compareObjects = (obj1, obj2) => {
  const result = [];

  Object.entries(obj1).forEach(([key, value]) => {
    switch (typeof value) {
      case 'object':
        break;
      default:
        if (_.has(obj2, key)) {
          const isSame = value === obj2[key];

          if (isSame) {
            result.push(formatter.keep(key, value));
          } else {
            result.push(formatter.remove(key, value));

            if (_.has(obj2, key)) {
              result.push(formatter.add(key, obj2[key]));
            }
          }
        } else {
          result.push(formatter.remove(key, value));
        }

        // console.log(Object.keys(obj1));
        // console.log(obj1, obj2);
          const addedKeys = _.difference(Object.keys(obj2), Object.keys(obj1));
          addedKeys.forEach(key => result.push(formatter.add(key, obj2[key])));
    }
  });

  return result;
};

export default (filepath1, filepath2) => {
  const firstFileParser = chooseParser(filepath1);
  const secondFileParser = chooseParser(filepath2);
  const firstFileContent = readFileSync(path.resolve(filepath1), 'utf8');
  const secondFileContent = readFileSync(path.resolve(filepath2), 'utf8');
  const beforeConfig = firstFileParser(firstFileContent);
  const afterConfig = secondFileParser(secondFileContent);

  const acc = [];

  Object.entries(beforeConfig).forEach(([key, value]) => {
    compare(beforeConfig, afterConfig);
    if (typeof value === 'object') {
    //   if (_.has(afterConfig, key)) {
    //     const foo = compareObjects(value, afterConfig[key])
    //     acc.push(formatOutput(foo));
    //   } else {
    //     acc.push(formatter.remove(key, value));
    //   }
    }
    const isSame = value === afterConfig[key];

    if (isSame) {
      acc.push(formatter.keep(key, value));
    } else {
      acc.push(formatter.remove(key, value));

      if (_.has(afterConfig, key)) {
        acc.push(formatter.add(key, afterConfig[key]));
      }
    }
  });
  const addedKeys = _.difference(Object.keys(afterConfig), Object.keys(beforeConfig));
  addedKeys.forEach(key => acc.push(formatter.add(key, afterConfig[key])));

  return formatOutput(acc);
};
