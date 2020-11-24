import _ from 'lodash';

const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (_.isPlainObject(data)) return '[complex value]';

  return data;
};

const getChangelog = current => {
  if (current.type === 'removal') return 'removed';
  if (current.type === 'addition') return `added with value: ${dataFormatter(current.data)}`;
  if (current.type === 'modified') {
    return `updated. From ${dataFormatter(current.removedData)} to ${dataFormatter(
      current.addedData,
    )}`;
  }

  return null;
};

const getChangelogMessageOrNull = (node, key) => {
  const changelog = getChangelog(node);

  return changelog ? `Property '${key}' was ${changelog}` : null;
};

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
