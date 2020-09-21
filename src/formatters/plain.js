const getChangelog = (entry, next) => {
  if (entry.modification === 'keep') return;

  if (typeof next === 'undefined') return 'last one';

  if (entry.keyName === next.keyName) {
    return 'updated from something to something';
  } else if (entry.modification === 'add') {
    return 'added';
  } else {
    return 'removed';
  }
};

const plain = diffEntries => {
  const formattedEntries = [];

  diffEntries.forEach((entry, index) => {
    const prev = diffEntries[index - 1];
    // TODO think about next line logic
    if (prev && entry.keyName === prev.keyName) return;

    const changelog = getChangelog(entry, diffEntries[index + 1]);

    if (changelog) formattedEntries.push(`Property '${entry.keyName}' was ${changelog}`);
  });

  const multilineDiff = formattedEntries.join('\n');

  return multilineDiff;
};

export default plain;
