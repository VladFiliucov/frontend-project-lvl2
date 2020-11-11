import path from 'path';
import gendiff from '../index.js';

let formattedStylishDiff;
let formattedPlainDiff;
let formattedJSONDiff;

beforeAll(() => {
  formattedStylishDiff = `{
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

  formattedPlainDiff = `Property 'type' was updated. From 'module' to true
Property 'setting6.ops' was added with value: 'vops'
Property 'description' was updated. From 'CLI tool for comparing config files' to 'CLI foo tool for comparing config files'
Property 'proxy' was removed
Property 'nest' was removed
Property 'simple' was updated. From true to [complex value]
Property 'subset.key.foo' was updated. From 'bar' to 'baz'
Property 'verbose' was added with value: true
Property 'new_object' was added with value: [complex value]`;

  formattedJSONDiff = `[{"keyName":"name","path":"name","type":"primitive","data":"gendiff","depth":1,"modification":"keep"},{"keyName":"type","path":"type","type":"primitive","data":"module","depth":1,"modification":"remove"},{"keyName":"type","modification":"add","depth":1,"path":"type","type":"primitive","data":true},{"keyName":"version","path":"version","type":"primitive","data":"1.0.0","depth":1,"modification":"keep"},{"keyName":"setting6","path":"setting6","type":"object","depth":1,"modification":"keep","children":[{"keyName":"key","path":"setting6.key","type":"primitive","data":"value","depth":2,"modification":"keep"},{"keyName":"ops","path":"setting6.ops","modification":"add","data":"vops","depth":2,"type":"primitive"}]},{"keyName":"description","path":"description","type":"primitive","data":"CLI tool for comparing config files","depth":1,"modification":"remove"},{"keyName":"description","modification":"add","depth":1,"path":"description","type":"primitive","data":"CLI foo tool for comparing config files"},{"keyName":"proxy","path":"proxy","type":"primitive","data":false,"depth":1,"modification":"remove"},{"keyName":"nest","path":"nest","type":"object","depth":1,"modification":"remove","children":[{"keyName":"type","path":"nest.type","type":"primitive","modification":"keep","data":"module","depth":2},{"keyName":"moreNest","path":"nest.moreNest","type":"object","modification":"keep","depth":2,"children":[{"keyName":"name","path":"nest.moreNest.name","type":"primitive","modification":"keep","data":"vlad","depth":3}]}]},{"keyName":"simple","path":"simple","type":"primitive","data":true,"depth":1,"modification":"remove"},{"keyName":"simple","modification":"add","depth":1,"path":"simple","type":"object","children":[{"keyName":"made_easy","path":"simple.made_easy","type":"primitive","modification":"keep","data":true,"depth":2},{"keyName":"and","path":"simple.and","type":"object","modification":"keep","depth":2,"children":[{"keyName":"even","path":"simple.and.even","type":"primitive","modification":"keep","data":"easier","depth":3}]}]},{"keyName":"subset","path":"subset","type":"object","depth":1,"modification":"keep","children":[{"keyName":"key","path":"subset.key","type":"object","depth":2,"modification":"keep","children":[{"keyName":"foo","path":"subset.key.foo","type":"primitive","data":"bar","depth":3,"modification":"remove"},{"keyName":"foo","modification":"add","depth":3,"path":"subset.key.foo","type":"primitive","data":"baz"}]}]},{"keyName":"verbose","path":"verbose","modification":"add","data":true,"depth":1,"type":"primitive"},{"keyName":"new_object","modification":"add","depth":1,"path":"new_object","type":"object","children":[{"keyName":"name","path":"new_object.name","type":"primitive","modification":"keep","data":"zara home","depth":2},{"keyName":"address","path":"new_object.address","type":"object","modification":"keep","depth":2,"children":[{"keyName":"street","path":"new_object.address.street","type":"primitive","modification":"keep","data":"four dials","depth":3},{"keyName":"postcode","path":"new_object.address.postcode","type":"primitive","modification":"keep","data":"E20","depth":3}]}]}]`;
});

describe('gendiff', () => {
  describe('when unsupported format', () => {
    it('throws Unsupported format error', () => {
      expect(() => {
        gendiff('foo.doc', 'bar.png');
      }).toThrow('Unsupported format');
    });
  });

  // В формате ini не получилось использовать в перемешку корневые и вложенные свойства.
  // Как вариант - могу написать отдельную спеку для этого формата - что-бы выделить то, что
  // он работает иначе.
  describe.each(['json', 'yml' /* , 'ini' */])('in %s format', extension => {
    it('can generate diff for two objects in stylish format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath)).toBe(formattedStylishDiff);
    });

    it('can generate diff for two objects in plain format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'plain')).toBe(formattedPlainDiff);
    });

    it.skip('can generate diff for two objects in json format', () => {
      const beforeConfPath = path.join(process.cwd(), '__fixtures__', `confBefore.${extension}`);
      const afterConfPath = path.join(process.cwd(), '__fixtures__', `confAfter.${extension}`);

      expect(gendiff(beforeConfPath, afterConfPath, 'json')).toBe(formattedJSONDiff);
    });
  });
});
