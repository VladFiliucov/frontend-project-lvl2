import path from 'path';
import gendiff from '../index.js';

let formattedDiff;

beforeAll(() => {
  formattedDiff = `{
    name: gendiff
  - type: module
  + type: true
    version: 1.0.0
    setting6: {
        key: value
      + ops: vops
    }
  - description: CLI tool for comparing config files
  + description: CLI foo tool for comparing config files
  - proxy: false
  - nest: {
        type: module
        moreNest: {
            name: vlad
        }
    }
  - simple: true
  + simple: {
        made_easy: true
        and: {
            even: easier
        }
    }
    subset: {
        key: {
          - foo: bar
          + foo: baz
        }
    }
  + verbose: true
  + new_object: {
        name: zara home
        address: {
            street: four dials
            postcode: E20
        }
    }
}`;
});

describe('gendiff', () => {
  describe('when unsupported format', () => {
    it('throws Unsupported format error', () => {
      expect(() => {
        gendiff('foo.doc', 'bar.png');
      }).toThrow('Unsupported format');
    });
  });

  describe.each(['json', 'yml'])('in %s format', extension => {
  // describe.each(['json', 'yml', 'ini'])('in %s format', extension => {
  // describe.each(['json'])('in %s format', extension => {
    it('can generate diff for two objects', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedDiff);
    });
  });
});
