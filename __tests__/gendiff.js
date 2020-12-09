import path from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import gendiff from '../src/index.js';

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixturePath = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  path.join(process.cwd(), ...options.pathToFixtures, filename);

const getFixtureContent = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  readFileSync(path.resolve([...options.pathToFixtures, filename].join('/')), 'utf8');

const FILE_EXTENSIONS = ['json', 'yml'];
const SUPPORTED_FORMATS = ['Stylish', 'Plain', 'JSON'];

const formatsWithExtensions = FILE_EXTENSIONS.flatMap(extension =>
  SUPPORTED_FORMATS.map(format => [format, extension]),
);

describe('gendiff', () => {
  test.each(formatsWithExtensions)('format %s and extension %s', (format, extension) => {
    const beforeConfPath = getFixturePath(`confBefore.${extension}`);
    const afterConfPath = getFixturePath(`confAfter.${extension}`);
    const formattedDiff = _.trim(getFixtureContent(`formatted${format}Diff`));

    expect(gendiff(beforeConfPath, afterConfPath, format.toLowerCase())).toBe(formattedDiff);
  });
});
