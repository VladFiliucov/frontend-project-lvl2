import path from 'path';
import yaml from 'js-yaml';

const chooseParser = filePath => {
  const format = path.extname(filePath);

  if (format === '.json') return JSON.parse;
  if (format === '.yml' || format === '.yaml') return yaml.safeLoad;

  throw new Error('Unsupported format');
};

export default chooseParser;
