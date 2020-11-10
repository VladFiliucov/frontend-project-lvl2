const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const modifications = {
  add: '+ ',
  remove: '- ',
  keep: '  ',
  parent: '  ',
};

function isObject(obj) {
  return obj != null && obj.constructor.name === 'Object';
}

const toString = (data, nestingLevel) => {
  const currentIndentation = ' '.repeat(BASE_INDENTATION * (nestingLevel + 1));

  if (isObject(data)) {
    const start = '{';
    const end = ' '.repeat(BASE_INDENTATION * nestingLevel) + '}';
    const entries = Object.keys(data).map(key => {
      if (isObject(data[key])) {
        return `${currentIndentation}${key}: ${toString(data[key], nestingLevel + 1)}`;
      }

      return currentIndentation + `${key}: ${data[key]}`;
    });

    return [start, ...entries, end].join('\n');
  }

  return data;
};

const stylish = diffEntries => {
  const formatOutput = (entries, nestingDepth, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      add: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}+ ${key}: ${toString(
          data,
          nestingLevel,
        )}`,
      remove: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${toString(
          data,
          nestingLevel,
        )}`,
      keep: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel)}${key}: ${data}`,
      modified: ({ key, removedData, addedData, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${toString(
          removedData,
          nestingLevel,
        )}\n${' '.repeat(
          BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS,
        )}+ ${key}: ${toString(addedData, nestingLevel)}`,
    };

    const keyWithModification =
      nestedKeyModification && `${modifications[nestedKeyModification].concat(nestedKeyName)}`;

    const start = nestedKeyName
      ? `${' '.repeat(nestingDepth - SPACE_FOR_OPERATORS).concat(keyWithModification)}: {`
      : `${' '.repeat(nestingDepth)}{`;
    const end = `${' '.repeat(nestingDepth)}}`;
    const indentedEntries = entries.map(entry => {
      const entryContent = Array.isArray(entry.children)
        ? formatOutput(entry.children, entry.nestingLevel * BASE_INDENTATION, entry.key, entry.type)
        : formatter[entry.type](entry);

      return entryContent;
    });
    const result = [start, ...indentedEntries, end];
    const multilineDiff = result.join('\n');

    return multilineDiff;
  };

  return formatOutput(diffEntries);
};

export default stylish;
