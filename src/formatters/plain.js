const getChangelog = (current, next) => {
  if (current.modification === 'keep') return;

  if (typeof next === 'undefined') return 'last one';

  if (current.path === next.path) {
    return 'updated from something to something';
  } else if (current.modification === 'add') {
    return 'added';
  } else {
    return 'removed';
  }
};

const plain = diffEntries => {
  const formattedEntries = [];

  diffEntries.forEach((entry, index) => {
    const prev = diffEntries[index - 1];
    const current = entry;
    const next = diffEntries[index + 1];
    // TODO think about next line logic
    // TODO need to iterate over children as well
    if (prev && current.path === prev.path) return;

    const changelog = getChangelog(current, next);

    if (changelog) formattedEntries.push(`Property '${current.path}' was ${changelog}`);
  });

  const multilineDiff = formattedEntries.join('\n');

  return multilineDiff;
};

export default plain;
