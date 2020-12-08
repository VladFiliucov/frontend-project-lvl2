import path from 'path';
import gendiff from '../src/index.js';
import formattedStylishDiff from './__fixtures__/formattedStylishDiff.js';
import formattedPlainDiff from './__fixtures__/formattedPlainDiff.js';
import formattedJSONDiff from './__fixtures__/formattedJSONDiff.js';

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixture = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  path.join(process.cwd(), ...options.pathToFixtures, filename);

describe('gendiff', () => {
  test('can throw Unsupported format error', () => {
    expect(() => {
      const pathToUnsupportedTypeFile = getFixture('foo.doc');

      gendiff(pathToUnsupportedTypeFile, pathToUnsupportedTypeFile);
    }).toThrow('Format doc is not supported. Supported formats are json, yml, yaml, ini');
  });

  test.each(['json', 'yml'])('can generate dif in %s format', extension => {
    const beforeConfPath = getFixture(`confBefore.${extension}`);
    const afterConfPath = getFixture(`confAfter.${extension}`);

    expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedStylishDiff);
    expect(gendiff(beforeConfPath, afterConfPath, 'stylish')).toBe(formattedStylishDiff);
    expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedPlainDiff);
    expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedJSONDiff);
  });
});
