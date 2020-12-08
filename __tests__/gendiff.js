import path from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import gendiff from '../src/index.js';

const FIXTURES_PATH = ['__tests__', '__fixtures__'];

const getFixturePath = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  path.join(process.cwd(), ...options.pathToFixtures, filename);

const getFixtureContent = (filename, options = { pathToFixtures: FIXTURES_PATH }) =>
  readFileSync(path.resolve([...options.pathToFixtures, filename].join('/')), 'utf8');

describe('gendiff', () => {
  test.each(['json', 'yml'])('can generate dif in %s format', extension => {
    const beforeConfPath = getFixturePath(`confBefore.${extension}`);
    const afterConfPath = getFixturePath(`confAfter.${extension}`);
    const formattedStylishDiff = _.trim(getFixtureContent('formattedStylishDiff'));
    const formattedPlainDiff = _.trim(getFixtureContent('formattedPlainDiff'));
    const formattedJSONDiff = _.trim(getFixtureContent('formattedJSONDiff'));

    expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedStylishDiff);
    expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedPlainDiff);
    expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedJSONDiff);
  });
});
