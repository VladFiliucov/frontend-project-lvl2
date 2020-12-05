const formattedStylishDiff = `{
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

export default formattedStylishDiff;
