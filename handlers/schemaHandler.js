const getPropTypeSchema = require('../utils/getPropTypeSchema');
const getFlowTypeSchema = require('../utils/getFlowTypeSchema');

const getPartSchema = (props) => {
  const required = [];

  const properties = Object.keys(props).reduce((res, key) => {
    const original = props[key];

    if (!original) {
      return res;
    }

    const {
      description = '',
      tsType,
      flowType,
      required: originalRequired,
    } = original;

    const ignored = description.includes('ignored');
    const tsOrFlow = tsType || flowType

    const fn = tsOrFlow ? getFlowTypeSchema : getPropTypeSchema;
    const schema = ignored ? original : fn(original);

    if (schema) {
      res[key] = schema;
    }

    if (!ignored && originalRequired) {
      required.push(key);
    }

    return res;
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
  } = getPartSchema(props);

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
  const toObject = documentation.toObject.bind(documentation);

  documentation.toObject = () => {
    const obj = toObject();

    obj.props = obj.props || {};
    obj.propsSchema = getJSONSchema(obj);

    return obj;
  };
};
