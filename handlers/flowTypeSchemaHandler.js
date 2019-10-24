const ReactDocgen = require('react-docgen');
const safeEval = require('../utils/safeEval');

const { utils: { getFlowTypeFromReactComponent } = {} } = ReactDocgen;

const convertProperty = (signatureProperty = {}) => {
  const { value = {}, description, params, alias } = signatureProperty;
  const { name, type, signature = {}, elements = [], value: currValue } = value;

  const currType = type || name;

  const result = {
    type: currType,
    format: alias,
    description,
    params,
  };

  if (currType === 'union') {
    const currElements = elements.map(
      (item = {}) => convertProperty({ value: item }),
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
    result.items = convertProperty({ value: first });
  } else if (currType === 'object') {
    // eslint-disable-next-line
    const obj = convertProperties(signature.properties) || {};
    const { properties, required = [] } = obj;

    result.properties = properties;

    if (required.length) {
      result.required = result.required;
    }
  } else if (currType === 'function') {
    result.type = 'func';
  } else if (currType === 'literal') {
    const defaultValue = safeEval(currValue);
    const defaultValueType = typeof defaultValue;

    result.default = defaultValue;
    result.type = Array.isArray(defaultValueType) ? 'array' : defaultValueType;
  }

  return result;
};

const convertProperties = (signatureProperties = []) => {
  const required = [];
  const properties = signatureProperties.reduce((res = {}, item = {}) => {
    const { key, required: itemRequired } = item;

    itemRequired && required.push(key);
    res[key] = convertProperty(item);

    return res;
  }, {});

  return {
    required,
    properties,
  };
};

const getSchemaProperties = (props = {}) => {
  const required = [];

  const properties = Object.keys(props).reduce((result, key) => {
    const original = props[key] || {};
    const { tsType, flowType, ...others } = original;
    const { description = '' } = others;

    if (description.indexOf('@ignore') > -1) {
      return result;
    }

    if (original.required) {
      required.push(key);
    }

    const value = convertProperty({
      value: flowType || tsType || {},
      ...others,
    });

    if (value) {
      result[key] = value;
    }

    return result;
  }, {});

  return {
    properties,
    required,
  };
};

const getJSONSchema = (input = {}) => {
  const {
    props = {},
    displayName = '',
    description,
  } = input;

  const {
    properties,
    required,
  } = getSchemaProperties(props);

  const jsonSchema = {
    title: displayName,
    type: 'object',
    description,
    properties,
  };

  if (required.length) {
    jsonSchema.required = required;
  }

  return jsonSchema;
};

module.exports = (documentation, path) => {
  const flowTypesPath = getFlowTypeFromReactComponent(path);

  if (!flowTypesPath) {
    return;
  }

  const toObject = documentation.toObject.bind(documentation);

  documentation.toObject = () => {
    const obj = toObject();

    obj.props = obj.props || {};
    obj.propsSchema = getJSONSchema(obj);

    return obj;
  };
};