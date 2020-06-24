import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const chooseParser = filePath => {
  const format = path.extname(filePath);

  if (format === '.json') return JSON.parse;
  if (format === '.yml' || format === '.yaml') return yaml.safeLoad;
  if (format === '.ini') return ini.parse;

  throw new Error('Unsupported format');
};

export default chooseParser;
