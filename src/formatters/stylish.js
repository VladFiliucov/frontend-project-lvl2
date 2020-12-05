import _ from 'lodash';

const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const indent = depth => ' '.repeat(BASE_INDENTATION * depth - SPACE_FOR_OPERATORS);

const getChangelog = (node, depth) => {
  if (node.type === 'persisted')
    return `${indent(depth)}  ${node.key}: ${dataFormatter(node.data, depth)}`;
  if (node.type === 'addition')
    return `${indent(depth)}+ ${node.key}: ${dataFormatter(node.data, depth)}`;
  if (node.type === 'removal')
    return `${indent(depth)}- ${node.key}: ${dataFormatter(node.data, depth)}`;

  const removed = `${indent(depth)}- ${node.key}: ${dataFormatter(node.removedData, depth)}`;
  const added = `${indent(depth)}+ ${node.key}: ${dataFormatter(node.addedData, depth)}`;
  return [removed, added];
};

const stylish = diffEntries => {
  const iter = (nodes, depth) =>
    nodes.flatMap(node => {
      if (node.type === 'parent') {
        return [
          `  ${indent(depth)}${node.key}: {`,
          iter(node.children, depth + 1).join('\n'),
          `  ${indent(depth)}}`,
        ];
      }

      return getChangelog(node, depth) || [];
    });
  const diff = iter(diffEntries, 1);

  return ['{', ...diff, '}'].join('\n');
};

const dataFormatter = (data, depth) => {
  if (_.isPlainObject(data)) {
    const formattedObjectDiff = Object.entries(data)
      .map(
        ([entryKey, entryValue]) =>
          `${indent(depth)}      ${entryKey}: ${dataFormatter(entryValue, depth + 1)}`,
      )
      .join('\n');
    return [`{\n${formattedObjectDiff}\n${indent(depth)}  }`];
  }
  return data;
};


export default stylish;
