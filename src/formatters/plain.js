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

  return null; // To make linter happy with consistent returns
};

const plain = diffEntries => {
  const iter = (nodes, nameAcc) =>
    nodes.flatMap(node => {
      if (node.type === 'parent') return iter(node.children, [...nameAcc, node.key]);

      const changelog = getChangelog(node);
      const keyName = [...nameAcc, node.key].join('.');

      return changelog ? `Property '${keyName}' was ${changelog}` : [];
    });

  return iter(diffEntries, []).join('\n');
};

export default plain;
