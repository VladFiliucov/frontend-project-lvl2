import path from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import gendiff from '../src/index.js';

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixturePath = (filename) => (
  path.join(process.cwd(), ...FIXTURES_PATH, filename)
);

const getFixtureContent = (filename) => readFileSync(path.resolve(path.join(...[...FIXTURES_PATH, filename])), 'utf8');

const FILE_EXTENSIONS = ['json', 'yml'];

const formattedDiffs = {
  stylish: _.trim(getFixtureContent('formattedStylishDiff')),
  plain: _.trim(getFixtureContent('formattedPlainDiff')),
  json: _.trim(getFixtureContent('formattedJSONDiff')),
};

describe('gendiff', () => {
  test.each(FILE_EXTENSIONS)('works with %s files', (extension) => {
    const beforeConfPath = getFixturePath(`confBefore.${extension}`);
    const afterConfPath = getFixturePath(`confAfter.${extension}`);

    expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedDiffs.stylish);
    expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedDiffs.plain);
    expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedDiffs.json);
  });
});
