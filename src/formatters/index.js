import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const FORMATTERS = { stylish, plain, json };

export default (format, rawData) => {
  const formatter = FORMATTERS[format];

  if (formatter) return formatter(rawData);

  throw new Error(
    `Output format ${format} is not supported. Try one of ${Object.keys(FORMATTERS).join(', ')}`,
  );
};
