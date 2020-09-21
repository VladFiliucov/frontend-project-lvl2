const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const modifications = {
  add: '+ ',
  remove: '- ',
  keep: '  ',
};

const stylish = diffEntries => {
  const formatOutput = (entries, nestingLevel = 0, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      add: (key, value, nestingDepth) =>
        `${' '.repeat(BASE_INDENTATION * nestingDepth - SPACE_FOR_OPERATORS)}+ ${key}: ${value}`,
      remove: (key, value, nestingDepth) =>
        `${' '.repeat(BASE_INDENTATION * nestingDepth - SPACE_FOR_OPERATORS)}- ${key}: ${value}`,
      keep: (key, value, nestingDepth) =>
        `${' '.repeat(BASE_INDENTATION * nestingDepth)}${key}: ${value}`,
    };

    const keyWithModification =
      nestedKeyModification && `${modifications[nestedKeyModification].concat(nestedKeyName)}`;

    const start = nestedKeyName
      ? `${' '.repeat(nestingLevel - SPACE_FOR_OPERATORS).concat(keyWithModification)}: {`
      : `${' '.repeat(nestingLevel)}{`;
    const end = `${' '.repeat(nestingLevel)}}`;
    const indentedEntries = entries.map(entry => {
      const entryContent = Array.isArray(entry.children)
        ? formatOutput(
            entry.children,
            entry.depth * BASE_INDENTATION,
            entry.keyName,
            entry.modification,
          )
        : formatter[entry.modification](entry.keyName, entry.data, entry.depth);

      return entryContent;
    });
    const result = [start, ...indentedEntries, end];
    const multilineDiff = result.join('\n');

    return multilineDiff;
  };

  return formatOutput(diffEntries);
};

export default format => {
  switch (format) {
    case 'stylish':
      return stylish;
    default:
      throw new Error('only supported output format is stylish');
  }
};
