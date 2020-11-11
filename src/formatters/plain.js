import isObject from '../utils.js';

const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (isObject(data)) return '[complex value]';

  return data;
};

const getChangelog = current => {
  if (current.type === 'remove') return 'removed';
  if (current.type === 'add') return `added with value: ${dataFormatter(current.data)}`;
  if (current.type === 'modified') {
    return `updated. From ${dataFormatter(current.removedData)} to ${dataFormatter(
      current.addedData,
    )}`;
  }

  return null;
};

const getChangelogMessageOrNull = (node, key) =>
  getChangelog(node) && `Property '${key}' was ${getChangelog(node)}`;

const getChildrenChangelog = (children, parents) => {
  return children.map(child => {
    if (child.children && child.children.length) {
      return getChildrenChangelog(child.children, parents.concat(child.key));
    }

    return getChangelogMessageOrNull(child, [...parents, child.key].join('.'));
  });
};

const plain = diffEntries => {
  const formattedEntries = diffEntries.map(entry => {
    return entry.children && entry.children.length
      ? getChildrenChangelog(entry.children, [entry.key])
      : getChangelogMessageOrNull(entry, entry.key);
  });

  const multilineDiff = formattedEntries.flat(Infinity).filter(Boolean).join('\n');

  return multilineDiff;
};

export default plain;
