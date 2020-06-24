import path from 'path';
import gendiff from '../index.js';

describe('gendiff', () => {
  it('can generate diff for two objects', () => {
    const beforeConfPath = path.join(process.cwd(), '__fixtures__', 'confBefore.json');
    const afterConfPath = path.join(process.cwd(), '__fixtures__', 'confAfter.json');

    expect(gendiff(beforeConfPath, afterConfPath)).toBe(
      `{
    name: gendiff
  - type: module
  + type: true
    version: 1.0.0
  - description: CLI tool for comparing config files
  + description: CLI foo tool for comparing config files
  - proxy: false
  + verbose: true
}`,
    );
  });
});
