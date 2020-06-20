import gendiff from '../index.js';

let beforeConfig;
let afterConfig;

beforeEach(() => {
  beforeConfig = {
    name: 'gendiff',
    type: 'module',
    version: '1.0.0',
    description: 'CLI tool for comparing config files',
  };

  afterConfig = {
    name: 'gendiff',
    type: true,
    version: '1.0.0',
    description: 'CLI foo tool for comparing config files',
  };
});

describe('gendiff', () => {
  it('can generate diff for two objects', () => {
    expect(gendiff(beforeConfig, afterConfig)).toBe(
      `{
    name: gendiff
  - type: module
  + type: true
    version: 1.0.0
  - description: CLI tool for comparing config files
  + description: CLI foo tool for comparing config files
}`,
    );
  });
});
