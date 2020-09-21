const plain = diffEntries => {
  const formattedEntries = [];

  diffEntries.forEach((entry, index) => {
    formattedEntries.push(`Property ${entry.keyName} with index ${index}`);
  });

  const multilineDiff = formattedEntries.join('\n');

  return multilineDiff;
};

export default plain;
