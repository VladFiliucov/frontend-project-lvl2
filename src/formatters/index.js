import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const FORMATTERS = { stylish, plain, json: (diffEntries) => JSON.stringify(diffEntries) };

export default (format, rawData) => {
  if (_.has(FORMATTERS, format)) return FORMATTERS[format](rawData);

  throw new Error(
    `Output format ${format} is not supported. Try one of ${Object.keys(FORMATTERS).join(', ')}`,
  );
};
