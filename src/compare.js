import _ from 'lodash';

const formatter = {
  add: (key, value, ofset = 2) => `${' '.repeat(ofset)}+ ${key}: ${value}`,
  remove: (key, value, ofset = 2) => `${' '.repeat(ofset)}- ${key}: ${value}`,
  keep: (key, value, ofset = 4) => `${' '.repeat(ofset)}${key}: ${value}`,
};

const compare = (beforeConfig, afterConfig) => {
  [
    {keyName: 'bar', type: 'primitive', data: 'foo', depth: 0, path: 'bar', modification: 'add'},
    {keyName: 'woot', type: 'primitive', data: 'eyye', depth: 0, path: 'woot', modification: 'remove'},
    {keyName: 'window', type: 'primitive', data: 'eyye', depth: 0, path: 'window', modification: 'keep'},
    {keyName: 'vlad', type: 'object', data: {
      keyName: 'zoo', type: 'primitive', data: 'foo', depth: 1, path: 'vlad.zoo', modification: 'add'
    }, depth: 1, path: 'vlad'}
  ]
  const result = [];

  const getPrimitiveModificationType = (beforePrimitive, afterPrimitive) => (
    (beforePrimitive === afterPrimitive) ? 'keep' : 'add'
  );

  const innerCompare = (nestedBefore, nestedAfter, nestingLevel = 0) => {
    const tempData = {};

    Object.entries(nestedBefore).forEach(([key, value]) => {
      tempData.keyName = key

      switch (typeof value) {
        case 'object':
          // TODO array, null and function are also objects.
          tempData.type = 'object';
          if (_.has(nestedAfter, key)) {
            tempData.data = innerCompare(nestedBefore[key], nestedAfter[key], nestingLevel + 1);
          } else {
            tempData.data = nestedBefore[key];
            tempData.modification = 'remove';
            tempData.depth = nestingLevel + 1;
          }
          break;
        default:
          tempData.type = 'primitive';
          tempData.data = value;
          tempData.depth = nestingLevel;
          // Next line breaks because nested object might not have path to required key
          // That is where we might want to use lodash function that finds property on the object safely
          // Еще следует подумать имеет ли смысл искть в детских объекта, если мы знаем что второго объекта нет вообще
          // TODO START HERE
          tempData.modification = getPrimitiveModificationType(nestedBefore[key], nestedAfter[key]);
      }
    });

    return tempData;
  }

  Object.entries(beforeConfig).forEach(([key, value]) => {
    const temp = {key}

    switch (typeof value) {
      case 'object':
        temp.type = 'object';
        temp.data = innerCompare(value, afterConfig[key], 1);
        break;
      default:
        // temp.type = 'primitive';
    }

    result.push(temp)
  });
  console.log("Temp", result);
}

export default compare;
