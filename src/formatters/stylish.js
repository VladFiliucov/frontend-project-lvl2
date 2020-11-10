const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const modifications = {
  add: '+ ',
  remove: '- ',
  keep: '  ',
};

const stylish = diffEntries => {
  const formatOutput = (entries, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      add: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}+ ${key}: ${data}`,
      remove: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${data}`,
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

    const start = nestedKeyName
      ? `${' '.repeat(nestingLevel - SPACE_FOR_OPERATORS).concat(keyWithModification)}: {`
      : `${' '.repeat(nestingLevel)}{`;
    const end = `${' '.repeat(nestingLevel)}}`;
    const indentedEntries = entries.map(entry => {
      const entryContent = Array.isArray(entry.children) ? 'yo' : formatter[entry.type](entry);
      // ? formatOutput(
      //     entry.children,
      //     entry.depth * BASE_INDENTATION, REMOVED THIS
      //     entry.keyName,
      //     entry.modification,
      //   )

      return entryContent;
    });
    const result = [start, ...indentedEntries, end];
    const multilineDiff = result.join('\n');

    return multilineDiff;
  };

  return formatOutput(diffEntries);
};

export default stylish;
