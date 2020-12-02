import _ from 'lodash';

const BASE_INDENTATION = 4;
const SPACE_FOR_OPERATORS = 2;

const modifications = {
  addition: '+ ',
  removal: '- ',
  persisted: '  ',
  parent: '  ',
};

const toString = (data, nestingLevel) => {
  const currentIndentation = ' '.repeat(BASE_INDENTATION * (nestingLevel + 1));

  if (_.isPlainObject(data)) {
    const end = `${' '.repeat(BASE_INDENTATION * nestingLevel)}}`;
    const entries = Object.keys(data).map(key => {
      if (_.isPlainObject(data[key])) {
        return `${currentIndentation}${key}: ${toString(data[key], nestingLevel + 1)}`;
      }

      return `${currentIndentation}${key}: ${data[key]}`;
    });

    return ['{', ...entries, end].join('\n');
  }

  return data;
};

const stylishx = diffEntries => {
  const formatOutput = (entries, nestingDepth, nestedKeyName, nestedKeyModification) => {
    const formatter = {
      addition: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}+ ${key}: ${toString(
          data,
          nestingLevel,
        )}`,
      removal: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${toString(
          data,
          nestingLevel,
        )}`,
      persisted: ({ key, data, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel)}${key}: ${data}`,
      modified: ({ key, removedData, addedData, nestingLevel }) =>
        `${' '.repeat(BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS)}- ${key}: ${toString(
          removedData,
          nestingLevel,
        )}\n${' '.repeat(
          BASE_INDENTATION * nestingLevel - SPACE_FOR_OPERATORS,
        )}+ ${key}: ${toString(addedData, nestingLevel)}`,
    };

    const keyWithModification =
      nestedKeyModification && `${modifications[nestedKeyModification].concat(nestedKeyName)}`;

    const start = nestedKeyName
      ? `${' '.repeat(nestingDepth - SPACE_FOR_OPERATORS).concat(keyWithModification)}: {`
      : `${' '.repeat(nestingDepth)}{`;
    const end = `${' '.repeat(nestingDepth)}}`;
    const indentedEntries = entries.map(entry => {
      const entryContent = Array.isArray(entry.children)
        ? formatOutput(entry.children, entry.nestingLevel * BASE_INDENTATION, entry.key, entry.type)
        : formatter[entry.type](entry);

      return entryContent;
    });
    const result = [start, ...indentedEntries, end];
    const multilineDiff = result.join('\n');

    return multilineDiff;
  };

  return formatOutput(diffEntries);
};

const dataFormatter = data => {
  if (_.isPlainObject(data)) return '[complex value]';

  return data;
};

const indent = depth => ' '.repeat(BASE_INDENTATION * depth - SPACE_FOR_OPERATORS);

const getChangelog = (node, depth) => {
  if (node.type === 'persisted') {
    return `${indent(depth)}  ${node.key}: ${dataFormatter(node.data)}`;
  }
  if (node.type === 'modified') {
    const removed = `${indent(depth)}- ${node.key}: ${dataFormatter(node.removedData)}`;
    const added = `${indent(depth)}+ ${node.key}: ${dataFormatter(node.addedData)}`;

    return [removed, added];
  }
  if (node.type === 'addition') {
    return `${indent(depth)}+ ${node.key}: ${dataFormatter(node.data)}`;
  }
  if (node.type === 'removal') {
    return `${indent(depth)}- ${node.key}: ${dataFormatter(node.data)}`;
  }
  // if (current.type === 'modified') {
  //   return `updated. From ${dataFormatter(current.removedData)} to ${dataFormatter(
  //     current.addedData,
  //   )}`;
  // }

  return null; // To make linter happy with consistent returns
};

const stylish = diffEntries => {
  const iter = (nodes, depth) => {
    return nodes.flatMap(node => {
      if (node.type === 'parent') {
        return [
          `  ${indent(depth)}${node.key}: {`,
          iter(node.children, depth + 1).join('\n'),
          `  ${indent(depth)}}`,
        ];
      }

      return getChangelog(node, depth) || [];
    });
  };

  const diff = iter(diffEntries, 1);

  return ['{', ...diff, '}'].join('\n');
};

export default stylish;
