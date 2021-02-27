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
    defaultValue,
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

  if (defaultValue) {
    const { computed }  = defaultValue;

    if (computed) {
      result.default = defaultValue.value;
    } else {
      try {
        const baseDefaultValue = safeEval(defaultValue.value);

        if (baseDefaultValue !== undefined) {
          result.default = baseDefaultValue;
        }
      } catch (e) {
        console.log('could not evalulate defaultValue', defaultValue.value, e.message);
      }
    }
  }

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

    const firstItemsDefaultValue = result.default
      ? result.default[0]
      : undefined;

    const itemsDefaultValue = firstItemsDefaultValue === undefined
      ? undefined
      : { computed: true, value: firstItemsDefaultValue };

    const current = itemsDefaultValue === undefined
      ? { value: first }
      : { value: first, defaultValue: itemsDefaultValue };

    const items = getPropertySchema(current);

    result.type = 'array';
    result.items = items;
  } else if (currType === 'object') {
    // eslint-disable-next-line
    const obj = getPropertiesSchema(signature.properties, result.default) || {};
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
        ? { type: 'node' }
        : { type: returnName };
    }
  } else if (currType === 'literal') {
    const defaultValue = safeEval(currValue);
    const defaultValueType = typeof defaultValue;

    result.default = defaultValue;
    result.type = Array.isArray(defaultValueType) ? 'array' : defaultValueType;
  }

  return result;
};

const getPropertiesSchema = (signatureProperties = [], defaultValue = {}) => {
  const required = [];
  const properties = signatureProperties.reduce((res = {}, item = {}) => {
    const { key, required: itemRequired } = item;
    const { [key]: currentDefaultValue } = defaultValue;

    const defaultResult = {
      computed: true,
      value: currentDefaultValue,
    };

    const current = currentDefaultValue === undefined
      ? item
      : { defaultValue: defaultResult, ...item };

    itemRequired && required.push(key);
    res[key] = getPropertySchema(current);

    return res;
  }, {});

  return {
    required,
    properties,
  };
};

module.exports = getPropertySchema;
