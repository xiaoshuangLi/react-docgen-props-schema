const booleanKeys = [
  'exclusiveMinimum',
  'exclusiveMaximum',
  'uniqueItems',
];

const numberKeys = [
  'minLength',
  'maxLength',
  'minimum',
  'maximum',
  'minItems',
  'maxItems',
];

const keys = [
  ...booleanKeys,
  ...numberKeys,
  'pattern',
  'return',
];

const getResult = (source = {}) => (base = {}) => {
  return keys.reduce((res = {}, key) => {
    const value = source[key];

    if (value !== undefined) {
      res[key] = value;
    }

    return res;
  }, base);
};

module.exports = {
  booleanKeys,
  numberKeys,
  getResult,
};
