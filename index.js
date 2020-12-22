import { readFileSync } from 'fs';
import path from 'path';
import compare from './src/compare.js';
import parse from './src/parsers.js';
import formatter from './src/formatters/index.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const beforeConfigFormat = path.extname(filepath1).slice(1);
  const afterConfigFormat = path.extname(filepath1).slice(1);

  const beforeConfigContent = readFileSync(path.resolve(filepath1), 'utf8');
  const afterConfigContent = readFileSync(path.resolve(filepath2), 'utf8');

  const beforeConfig = parse(beforeConfigFormat, beforeConfigContent);
  const afterConfig = parse(afterConfigFormat, afterConfigContent);

  const rawData = compare(beforeConfig, afterConfig);

  return formatter(format, rawData);
};
