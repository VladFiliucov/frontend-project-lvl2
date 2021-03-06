import _ from 'lodash';

const dataFormatter = (data) => {
  if (typeof data === 'string') return `'${data}'`;
  if (_.isPlainObject(data)) return '[complex value]';

  return data;
};

const formatLine = (current, namesAcc = []) => {
  const keyName = [...namesAcc, current.key].join('.');

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
      return current.children.flatMap((child) => formatLine(child, [...namesAcc, current.key]));
    case 'unmodified':
      return [];
    default:
      throw new Error('Unrecognised node type: ', current.type);
  }
};

export default (diffEntries) => diffEntries.flatMap((node) => formatLine(node)).join('\n');
