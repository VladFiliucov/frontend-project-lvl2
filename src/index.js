import { readFileSync } from 'fs';
import path from 'path';
import compare from './compare.js';
import chooseParser from './parsers.js';
import formatter from './formatters/index.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const firstFileParser = chooseParser(filepath1);
  const secondFileParser = chooseParser(filepath2);
  const firstFileContent = readFileSync(path.resolve(filepath1), 'utf8');
  const secondFileContent = readFileSync(path.resolve(filepath2), 'utf8');
  const beforeConfig = firstFileParser(firstFileContent);
  const afterConfig = secondFileParser(secondFileContent);

  const result = compare(beforeConfig, afterConfig);

  return formatter(format)(result);
};
