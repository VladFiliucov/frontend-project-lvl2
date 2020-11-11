function isObject(obj) {
  return obj != null && obj.constructor.name === 'Object';
}

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

const getChildrenChangelog = (children, parents) => {
  return children.map(child => {
    if (child.children && child.children.length) {
      return getChildrenChangelog(child.children, parents.concat(child.key));
    }

    return (
      getChangelog(child) &&
      `Property '${[...parents, child.key].join('.')}' was ${getChangelog(child)}`
    );
  });
};

const plain = diffEntries => {
  const formattedEntries = diffEntries.map(entry => {
    return entry.children && entry.children.length
      ? getChildrenChangelog(entry.children, [entry.key])
      : getChangelog(entry)
      ? `Property '${entry.key}' was ${getChangelog(entry)}`
      : null;
  });

  const multilineDiff = formattedEntries
    .flat(Infinity)
    .filter(e => e !== null)
    .join('\n');

  return multilineDiff;
};

export default plain;
