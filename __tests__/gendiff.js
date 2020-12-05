import path from 'path';
import gendiff from '../src/index.js';
import formattedStylishDiff from './__fixtures__/formattedStylishDiff.js';
import formattedPlainDiff from './__fixtures__/formattedPlainDiff.js';

let formattedJSONDiff;

beforeAll(() => {
  formattedJSONDiff = `[{"key":"name","type":"persisted","data":"gendiff"},{"key":"type","type":"modified","removedData":"module","addedData":true},{"key":"version","type":"persisted","data":"1.0.0"},{"key":"setting6","type":"parent","children":[{"key":"key","type":"persisted","data":"value"},{"key":"ops","type":"addition","data":"vops"}]},{"key":"description","type":"modified","removedData":"CLI tool for comparing config files","addedData":"CLI foo tool for comparing config files"},{"key":"proxy","type":"removal","data":false},{"key":"nest","type":"removal","data":{"type":"module","moreNest":{"name":"vlad"}}},{"key":"simple","type":"modified","removedData":true,"addedData":{"made_easy":true,"and":{"even":"easier"}}},{"key":"subset","type":"parent","children":[{"key":"key","type":"parent","children":[{"key":"foo","type":"modified","removedData":"bar","addedData":"baz"}]}]},{"key":"verbose","type":"addition","data":true},{"key":"new_object","type":"addition","data":{"name":"zara home","address":{"street":"four dials","postcode":"E20"}}}]`;
});

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixture = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  path.join(process.cwd(), ...options.pathToFixtures, filename);

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
        const pathToUnsupportedTypeFile = getFixture('foo.doc');

        gendiff(pathToUnsupportedTypeFile, pathToUnsupportedTypeFile);
      }).toThrow('Format doc is not supported. Supported formats are json, yml, yaml, ini');
    });
  });

  // В формате ini не получилось использовать в перемешку корневые и вложенные свойства.
  // Как вариант - могу написать отдельную спеку для этого формата - что-бы выделить то, что
  // он работает иначе.
  describe.each(['json', 'yml' /* , 'ini' */])('in %s format', extension => {
    it('can generate diff for two objects in stylish format', () => {
      const beforeConfPath = getFixture(`confBefore.${extension}`);
      const afterConfPath = getFixture(`confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedStylishDiff);
    });

    it('can generate diff for two objects in plain format', () => {
      const beforeConfPath = getFixture(`confBefore.${extension}`);
      const afterConfPath = getFixture(`confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedPlainDiff);
    });

    it('can generate diff for two objects in json format', () => {
      const beforeConfPath = getFixture(`confBefore.${extension}`);
      const afterConfPath = getFixture(`confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedJSONDiff);
    });
  });
});
