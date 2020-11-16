import path from 'path';
import gendiff from '../index.js';

let formattedStylishDiff;
let formattedPlainDiff;
let formattedJSONDiff;

beforeAll(() => {
  formattedStylishDiff = `{
    name: gendiff
  - type: module
  + type: true
    version: 1.0.0
    setting6: {
        key: value
      + ops: vops
    }
  - description: CLI tool for comparing config files
  + description: CLI foo tool for comparing config files
  - proxy: false
  - nest: {
        type: module
        moreNest: {
            name: vlad
        }
    }
  - simple: true
  + simple: {
        made_easy: true
        and: {
            even: easier
        }
    }
    subset: {
        key: {
          - foo: bar
          + foo: baz
        }
    }
  + verbose: true
  + new_object: {
        name: zara home
        address: {
            street: four dials
            postcode: E20
        }
    }
}`;

  formattedPlainDiff = `Property 'type' was updated. From 'module' to true
Property 'setting6.ops' was added with value: 'vops'
Property 'description' was updated. From 'CLI tool for comparing config files' to 'CLI foo tool for comparing config files'
Property 'proxy' was removed
Property 'nest' was removed
Property 'simple' was updated. From true to [complex value]
Property 'subset.key.foo' was updated. From 'bar' to 'baz'
Property 'verbose' was added with value: true
Property 'new_object' was added with value: [complex value]`;

  formattedJSONDiff = `[{"key":"name","nestingLevel":1,"type":"keep","data":"gendiff"},{"key":"type","nestingLevel":1,"type":"modified","removedData":"module","addedData":true},{"key":"version","nestingLevel":1,"type":"keep","data":"1.0.0"},{"key":"setting6","nestingLevel":1,"type":"parent","children":[{"key":"key","nestingLevel":2,"type":"keep","data":"value"},{"key":"ops","nestingLevel":2,"type":"add","data":"vops"}]},{"key":"description","nestingLevel":1,"type":"modified","removedData":"CLI tool for comparing config files","addedData":"CLI foo tool for comparing config files"},{"key":"proxy","nestingLevel":1,"type":"remove","data":false},{"key":"nest","nestingLevel":1,"type":"remove","data":{"type":"module","moreNest":{"name":"vlad"}}},{"key":"simple","nestingLevel":1,"type":"modified","removedData":true,"addedData":{"made_easy":true,"and":{"even":"easier"}}},{"key":"subset","nestingLevel":1,"type":"parent","children":[{"key":"key","nestingLevel":2,"type":"parent","children":[{"key":"foo","nestingLevel":3,"type":"modified","removedData":"bar","addedData":"baz"}]}]},{"key":"verbose","nestingLevel":1,"type":"add","data":true},{"key":"new_object","nestingLevel":1,"type":"add","data":{"name":"zara home","address":{"street":"four dials","postcode":"E20"}}}]`;
});

describe('gendiff', () => {
  describe('when path to file does not exist', () => {
    it('throws path not found error', () => {
      expect(() => {
        gendiff('foo.doc', 'bar.png');
      }).toThrow('Did not find config file at given path');
    });
  });

  describe('when unsupported format', () => {
    it('throws Unsupported format error', () => {
      expect(() => {
        const pathToUnsupportedTypeFile = path.join(process.cwd(), '__fixtures__', 'foo.doc');

        gendiff(pathToUnsupportedTypeFile, pathToUnsupportedTypeFile);
      }).toThrow('Unsupported format');
    });
  });

  // В формате ini не получилось использовать в перемешку корневые и вложенные свойства.
  // Как вариант - могу написать отдельную спеку для этого формата - что-бы выделить то, что
  // он работает иначе.
  describe.each(['json', 'yml' /* , 'ini' */])('in %s format', extension => {
    it('can generate diff for two objects in stylish format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedStylishDiff);
    });

    it('can generate diff for two objects in plain format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedPlainDiff);
    });

    it('can generate diff for two objects in json format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedJSONDiff);
    });
  });
});
