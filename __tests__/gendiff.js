import path from 'path';
import gendiff from '../src/index.js';
import formattedStylishDiff from './__fixtures__/formattedStylishDiff.js';
import formattedPlainDiff from './__fixtures__/formattedPlainDiff.js';
import formattedJSONDiff from './__fixtures__/formattedJSONDiff.js';

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
