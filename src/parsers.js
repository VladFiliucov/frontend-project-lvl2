import yaml from 'js-yaml';

const PARSERS = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
};

const parse = (format, rawContent) => {
  const parser = PARSERS[format];

  if (parser) return parser(rawContent);

  throw new Error(
    `Format ${format} is not supported. Supported formats are ${Object.keys(PARSERS).join(', ')}`,
  );
};

export default parse;
