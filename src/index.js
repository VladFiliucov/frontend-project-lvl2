export default (beforeConfig, afterConfig) => {
  const result = ['{'];

  for (let [key, value] of Object.entries(beforeConfig)) {
    const isSame = value === afterConfig[key];

    if (isSame) {
      result.push(`    ${key}: ${value}`);
    } else {
      result.push(`  - ${key}: ${value}`);
      result.push(`  + ${key}: ${afterConfig[key]}`);
    }
  }
  result.push('}');
  const multilineDiff = result.join('\n')

  return multilineDiff
};
