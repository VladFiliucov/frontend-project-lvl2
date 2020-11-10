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

const toString = data => {
  if (isObject(data)) {
    return 'I am an object';
  }

  return data;
};

const stylish = diffEntries => {
  const formatOutput = (entries, nestingDepth, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      add: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}+ ${key}: ${data}`,
      remove: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${toString(
          data,
        )}`,
      keep: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel)}${key}: ${data}`,
      modified: ({ key, removedData, addedData, nestingLevel }) =>
        `${' '.repeat(
          BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS,
        )}- ${key}: ${removedData}\n${' '.repeat(
          BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS,
        )}+ ${key}: ${addedData}`,
      parent: ({ key, removedData, addedData, nestingLevel }) => `not sure yet`,
    };

    const keyWithModification =
      nestedKeyModification && `${modifications[nestedKeyModification].concat(nestedKeyName)}`;

    // Extract this into a func?
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
