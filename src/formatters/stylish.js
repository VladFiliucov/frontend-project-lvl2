import _ from 'lodash';

const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const indent = depth => ' '.repeat(BASE_INDENTATION * depth - SPACE_FOR_OPERATORS);

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

const getChangelog = (node, depth) => {
  if (node.type === 'unmodified')
    return `${indent(depth)}  ${node.key}: ${dataFormatter(node.data, depth)}`;
  if (node.type === 'added')
    return `${indent(depth)}+ ${node.key}: ${dataFormatter(node.data, depth)}`;
  if (node.type === 'deleted')
    return `${indent(depth)}- ${node.key}: ${dataFormatter(node.data, depth)}`;
  if (node.type === 'parent') {
    return [
      `  ${indent(depth)}${node.key}: {`,
      node.children.map(child => getChangelog(child, depth + 1)).join('\n'),
      `  ${indent(depth)}}`,
    ].join('\n');
  }

  const removed = `${indent(depth)}- ${node.key}: ${dataFormatter(node.removedData, depth)}`;
  const added = `${indent(depth)}+ ${node.key}: ${dataFormatter(node.addedData, depth)}`;
  return [removed, added].join('\n');
};

export default diffEntries =>
  ['{', diffEntries.flatMap(node => getChangelog(node, 1) || []).join('\n'), '}'].join('\n');
