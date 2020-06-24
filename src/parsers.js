import path from 'path';
import yaml from 'js-yaml';

const chooseFormatter = filePath => {
  const format = path.extname(filePath);

  if (format === '.json') return JSON.parse;
  if (format === '.yml' || format === '.yaml') return yaml.safeLoad;

  throw new Error('Unsupported format');
};

export default chooseFormatter;
