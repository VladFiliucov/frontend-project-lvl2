import _ from 'lodash';

const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (_.isPlainObject(data)) return '[complex value]';

  return data;
};

const getChangelog = (current, nameAcc = []) => {
  const keyName = [...nameAcc, current.key].join('.');

  switch (current.type) {
    case 'deleted':
      return `Property '${keyName}' was removed`;
    case 'added':
      return `Property '${keyName}' was added with value: ${dataFormatter(current.data)}`;
    case 'modified':
      return `Property '${keyName}' was updated. From ${dataFormatter(
        current.removedData,
      )} to ${dataFormatter(current.addedData)}`;
    case 'parent':
      return _.compact(
        current.children.map(child => getChangelog(child, [...nameAcc, current.key])),
      );
    default:
      return [];
  }
};

export default diffEntries => {
  const modificationMessages = diffEntries.map(node => getChangelog(node));

  return _.flattenDeep(modificationMessages).join('\n');
};
