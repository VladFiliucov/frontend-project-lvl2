import yaml from 'js-yaml';
import ini from 'ini';

const PARSERS = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

const chooseParser = format => {
  if (typeof PARSERS[format] !== 'undefined') return PARSERS[format];

  throw new Error('Unsupported format');
};

export default chooseParser;
