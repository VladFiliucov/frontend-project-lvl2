import _ from 'lodash';

const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const indent = (depth) => ' '.repeat(BASE_INDENTATION * depth - SPACE_FOR_OPERATORS);

const dataFormatter = (data, depth) => {
  if (!_.isPlainObject(data)) return data;

  const formattedObjectDiff = Object.entries(data)
    .map(
      ([entryKey, entryValue]) => (
        `${indent(depth)}      ${entryKey}: ${dataFormatter(entryValue, depth + 1)}`
      ),
    )
    .join('\n');

  return [`{\n${formattedObjectDiff}\n${indent(depth)}  }`];
};

const getChangelog = (node, depth) => {
  switch (node.type) {
    case 'unmodified':
      return `${indent(depth)}  ${node.key}: ${dataFormatter(node.data, depth)}`;
    case 'added':
      return `${indent(depth)}+ ${node.key}: ${dataFormatter(node.data, depth)}`;
    case 'deleted':
      return `${indent(depth)}- ${node.key}: ${dataFormatter(node.data, depth)}`;
    case 'parent':
      return [
        `  ${indent(depth)}${node.key}: {`,
        node.children.map((child) => getChangelog(child, depth + 1)).join('\n'),
        `  ${indent(depth)}}`,
      ].join('\n');
    case 'modified':
      return [
        `${indent(depth)}- ${node.key}: ${dataFormatter(node.removedData, depth)}`,
        `${indent(depth)}+ ${node.key}: ${dataFormatter(node.addedData, depth)}`,
      ].join('\n');
    default:
      throw new Error('Unknown type: ', node.type);
  }
};

export default (diffEntries) => {
  const logLines = diffEntries.map((node) => getChangelog(node, 1)).join('\n');

  return ['{', logLines, '}'].join('\n');
};
