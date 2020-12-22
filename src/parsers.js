import _ from 'lodash';
import yaml from 'js-yaml';

const PARSERS = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
};

const parse = (format, rawContent) => {
  if (_.has(PARSERS, format)) return PARSERS[format](rawContent);

  throw new Error(
    `Format ${format} is not supported. Supported formats are ${Object.keys(PARSERS).join(', ')}`,
  );
};

export default parse;
