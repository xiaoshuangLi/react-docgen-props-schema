const safeEval = require('./safeEval');

const { getResult } = require('../utils');

const getPropertySchema = (signatureProperty = {}) => {
  const {
    tsType = {},
    flowType = tsType,
    value = flowType,
    description,
    params,
    alias,
  } = signatureProperty;

  const {
    name,
    type,
    signature = {},
    elements = [],
    value: currValue,
  } = value;

  const a = type || name;
  const currType = a === 'ReactNode'
    ? 'node'
    : a;

  const result = getResult(signatureProperty)({
    type: currType,
    format: alias,
    description,
    params,
  });

  if (currType === 'union') {
    const currElements = elements.map(
      (item = {}) => getPropertySchema({ value: item }),
    );
    const [first] = currElements;

    if (!first) {
      return;
    }

    const isEnum = currElements.every(
      (item = {}) => item.type === first.type,
    );

    if (isEnum) {
      result.type = first.type;
      result.enum = currElements.map(
        (item = {}) => item.default || item.value,
      );
    } else {
      result.anyOf = currElements;
    }
  } else if (currType === 'tuple' || currType === 'array') {
    const [first] = elements;

    result.type = 'array';
    result.items = getPropertySchema({ value: first });
  } else if (currType === 'object') {
    // eslint-disable-next-line
    const obj = getPropertiesSchema(signature.properties) || {};
    const { properties, required = [] } = obj;

    result.properties = properties;

    if (required.length) {
      result.required = result.required;
    }
  } else if (currType === 'function') {
    const {
      arguments: args = [],
      return: { name: returnName } = {}
    } = signature;

    result.type = 'func';

    if (args.length && result.params === undefined) {
      result.params = args.map((item = {}) => {
        const { type: itemType = item } = item;

        return itemType.name;
      });
    }

    if (returnName && result.return === undefined) {
      result.return = returnName === 'ReactNode'
        ? 'node'
        : returnName;
    }
  } else if (currType === 'literal') {
    const defaultValue = safeEval(currValue);
    const defaultValueType = typeof defaultValue;

    result.default = defaultValue;
    result.type = Array.isArray(defaultValueType) ? 'array' : defaultValueType;
  }

  return result;
};

const getPropertiesSchema = (signatureProperties = []) => {
  const required = [];
  const properties = signatureProperties.reduce((res = {}, item = {}) => {
    const { key, required: itemRequired } = item;

    itemRequired && required.push(key);
    res[key] = getPropertySchema(item);

    return res;
  }, {});

  return {
    required,
    properties,
  };
};

module.exports = getPropertySchema;
