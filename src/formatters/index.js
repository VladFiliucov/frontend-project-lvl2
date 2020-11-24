import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (format, rawData) => {
  switch (format) {
    case 'stylish':
      return stylish(rawData);
    case 'plain':
      return plain(rawData);
    case 'json':
      return json(rawData);
    default:
      throw new Error('only supported output format is stylish');
  }
};
