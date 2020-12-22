import stylish from './stylish.js';
import plain from './plain.js';

const FORMATTERS = { stylish, plain, json: (diffEntries) => JSON.stringify(diffEntries) };

export default (format, rawData) => {
  const formatter = FORMATTERS[format];

  if (formatter) return formatter(rawData);

  throw new Error(
    `Output format ${format} is not supported. Try one of ${Object.keys(FORMATTERS).join(', ')}`,
  );
};
