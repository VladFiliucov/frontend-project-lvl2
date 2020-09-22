import _ from 'lodash';

const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (typeof data === 'boolean') return data;
  if (Array.isArray(data)) return '[complex value]';
}

const getChangelog = (current, next) => {
  if (current.modification === 'keep') return;

  if (typeof next === 'undefined') return 'last one';

  const currentData = current.data || current.children;
  const nextData = next.data || next.children;

  if (current.path === next.path) {
    return `updated. From ${dataFormatter(currentData)} to ${dataFormatter(nextData)}`;
  } else if (current.modification === 'add') {
    return `added with value: ${dataFormatter(currentData)}`;
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

    if (prev && current.path === prev.path) return;

    const changelog = getChangelog(current, next);

    if (current.keyName === 'ops') {
      console.log("Prev", prev);
      console.log("Current", current);
      console.log("Next", next);
    }
    if (changelog) formattedEntries.push(`Property '${current.path}' was ${changelog}`);

    if (current.children) {
      formattedEntries.push(plain(current.children));
    }
  });

  const multilineDiff = formattedEntries.join('\n');

  return multilineDiff;
};

export default plain;
