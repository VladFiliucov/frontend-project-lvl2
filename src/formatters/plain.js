const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (Array.isArray(data)) return '[complex value]';

  return data;
};

const getChangelog = (current, next) => {
  if (current.modification === 'keep') return null;

  const currentData = current.data || current.children;

  if (typeof next === 'undefined') {
    if (current.modification === 'add') return `added with value: ${dataFormatter(currentData)}`;
    return 'removed';
  }

  const nextData = next.data || next.children;

  if (current.path === next.path) {
    return `updated. From ${dataFormatter(currentData)} to ${dataFormatter(nextData)}`;
  }
  if (current.modification === 'add') {
    return `added with value: ${dataFormatter(currentData)}`;
  }
  return 'removed';
};

const plain = diffEntries => {
  const formattedEntries = [];

  diffEntries.forEach((entry, index) => {
    const prev = diffEntries[index - 1];
    const current = entry;
    const next = diffEntries[index + 1];

    if (prev && current.path === prev.path) return;

    const changelog = getChangelog(current, next);

    if (changelog) formattedEntries.push(`Property '${current.path}' was ${changelog}`);

    if (current.children) {
      formattedEntries.push(plain(current.children));
    }
  });

  const multilineDiff = formattedEntries.filter(entry => entry !== '').join('\n');

  return multilineDiff;
};

export default plain;
