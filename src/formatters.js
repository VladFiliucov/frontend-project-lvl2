const BASE_OFFSET = 4;

const modifications = {
  add: '+ ',
  remove: '- ',
  keep: '',
};

const stylish = diffEntries => {
  const formatOutput = (entries, nestingLevel = 0, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      add: (key, value, offset = 2) => `${' '.repeat(2 * offset)}+ ${key}: ${value}`,
      remove: (key, value, offset = 2) => `${' '.repeat(2 * offset)}- ${key}: ${value}`,
      keep: (key, value, offset = 4) => `${' '.repeat(4 * offset)}${key}: ${value}`,
    };

    const keyWithModification = nestedKeyModification && `${modifications[nestedKeyModification].concat(nestedKeyName)}`;

    const start = nestedKeyName
      ? `${' '.repeat(nestingLevel).concat(keyWithModification)}: {`
      : `${' '.repeat(nestingLevel)}{`;
    const end = `${' '.repeat(nestingLevel)}}`;
    const indentedEntries = entries.map(entry => {
      const entryContent = Array.isArray(entry.children)
        ? formatOutput(entry.children, entry.depth * BASE_OFFSET, entry.keyName, entry.modification)
        : formatter[entry.modification](entry.keyName, entry.data, entry.depth);

      return entryContent;
    });
    const result = [start, ...indentedEntries, end];
    const multilineDiff = result.join('\n');

    return multilineDiff;
  };

  const acc = [diffEntries[0], diffEntries[4]];

  // console.log(formatOutput(diffEntries));
  // return formatOutput(acc);
  return formatOutput(diffEntries);
};

export default stylish;
