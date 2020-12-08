import _ from 'lodash';

const dataFormatter = data => {
  if (typeof data === 'string') return `'${data}'`;
  if (_.isPlainObject(data)) return '[complex value]';

  return data;
};

const getChangelog = (current, nameAcc = []) => {
  const keyName = [...nameAcc, current.key].join('.');

  if (current.type === 'removal') return `Property '${keyName}' was removed`;
  if (current.type === 'addition')
    return `Property '${keyName}' was added with value: ${dataFormatter(current.data)}`;
  if (current.type === 'modified')
    return `Property '${keyName}' was updated. From ${dataFormatter(
      current.removedData,
    )} to ${dataFormatter(current.addedData)}`;
  if (current.type === 'parent')
    return _.compact(current.children.map(child => getChangelog(child, [...nameAcc, current.key])));

  return null; // To make linter happy with consistent returns
};

export default diffEntries => diffEntries.flatMap(node => getChangelog(node) || []).join('\n');
