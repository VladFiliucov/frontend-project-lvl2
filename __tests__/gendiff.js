import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => (
  join(__dirname, '__fixtures__', filename)
);

const getFixtureContent = (filename) => readFileSync(join(__dirname, '__fixtures__', filename));

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
