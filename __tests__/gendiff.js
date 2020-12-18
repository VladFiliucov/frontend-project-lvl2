import path from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import gendiff from '../src/index.js';

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixturePath = (filename) => (
  path.join(process.cwd(), ...FIXTURES_PATH, filename)
);

const getFixtureContent = (filename) => readFileSync(path.resolve([...FIXTURES_PATH, filename].join('/')), 'utf8');

const FILE_EXTENSIONS = ['json', 'yml'];
const SUPPORTED_FORMATS = ['Stylish', 'Plain', 'JSON'];

const formatsWithExtensions = FILE_EXTENSIONS.flatMap((extension) => (
  SUPPORTED_FORMATS.map((format) => [format, extension])
));

const formattedDiffs = {};

beforeAll(() => {
  SUPPORTED_FORMATS.forEach((format) => {
    formattedDiffs[format] = _.trim(getFixtureContent(`formatted${format}Diff`));
  });
});

describe('gendiff', () => {
  test.each(formatsWithExtensions)('format %s and extension %s', (format, extension) => {
    const beforeConfPath = getFixturePath(`confBefore.${extension}`);
    const afterConfPath = getFixturePath(`confAfter.${extension}`);
    const formattedDiff = formattedDiffs[format];

    expect(gendiff(beforeConfPath, afterConfPath, format.toLowerCase())).toBe(formattedDiff);
  });
});
