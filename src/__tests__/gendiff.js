import path from 'path';
import gendiff from '../index.js';

let formattedDiff;

beforeAll(() => {
  formattedDiff = `{
    name: gendiff
  - type: module
  + type: true
    version: 1.0.0
  - description: CLI tool for comparing config files
  + description: CLI foo tool for comparing config files
  - proxy: false
  + verbose: true
}`;
});

describe('gendiff', () => {
  describe('in JSON format', () => {
    it('can generate diff for two objects', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', 'confBefore.json');
      const afterConfPath = path.join(process.cwd(), '__fixtures__', 'confAfter.json');

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedDiff);
    });
  });

  describe('in YAML format', () => {
    it('can generate diff for two objects', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', 'confBefore.yml');
      const afterConfPath = path.join(process.cwd(), '__fixtures__', 'confAfter.yaml');

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedDiff);
    });
  });
});
