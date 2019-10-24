const ReactDocgen = require('react-docgen');
const safeEval = require('../utils/safeEval');

const { utils: { getFlowTypeFromReactComponent } = {} } = ReactDocgen;

// Extract JSON Schema style properties from react-docgen props.
const getSchemaProperties = (props) => {
  const required = [];

  const properties = Object.keys(props).reduce((result, key) => {
    const original = props[key];

    if (!original) {
      return;
    }

    const {
      type,
      description = '',
      required: originalRequired,
    } = original;

    // Skip props that have '@ignore' in description (eg. in material-ui)
    if (typeof description === 'undefined' && typeof type !== 'undefined') {
      if (type.description && type.description.indexOf('@ignore') > -1) {
        return result;
      }
    } else {
      if (description.indexOf('@ignore') > -1) {
        return result;
      }

      if (originalRequired) {
        required.push(key);
      }
    }

    // eslint-disable-next-line
    const value = getPropertyForProp(original);

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

const reduceShapeToProps = (shapes = {}) => Object.keys(shapes).reduce((result, key) => {
  result[key] = { type: shapes[key] };

  return result;
}, {});

// Convert a property extracted by react-docgen to a JSON Schema property.
const getPropertyForProp = (res = {}) => {
  const {
    type = {},
    value: baseDeepValue = {},
  } = res;

  const deepValue = { ...res, ...type, ...baseDeepValue };

  const {
    name = '',
    description,
    defaultValue,
    alias,
    params,
  } = deepValue;

  const result = {
    type: name,
  };

  if (description) {
    result.description = description;
  }

  if (alias) {
    result.format = alias;
  }

  if (params) {
    result.params = params;
  }

  if (name === 'enum') {
    // Only process enums if they're arrays. Don't process them if they are
    // references to an object.
    if (typeof type.value === 'object') {
      result.enum = type.value.reduce((collector, item) => {
        try {
          const value = safeEval(item.value);

          if (typeof item.value === 'object') {
            collector.push({
              value,
            });
          } else {
            collector.push(value);
          }
        } catch (e) {
          console.log('could not evalulate value', e);
          return collector;
        }

        return collector;
      }, []);

      // type is equal to all those found in the enum
      const types = result.enum.map((value) => typeof value)
        .filter((elem, pos, arr) => arr.indexOf(elem) === pos);

      result.type = types.length === 1 ? types[0] : types;
    } else {
      // Assume a string if not an object. This is because JS is loosely typed,
      // so we can normally get away with using a string.
      result.type = 'string';
    }
  } else if (name === 'union') {
    // Without parsing all schemas together then no ability to inter-reference one-
    // another through `"$ref": "#path/to/my/JsonSchemaType"`
    result.anyOf = type.value.map((subType) => getPropertyForProp({ type: subType }));
    delete result.type;
  } else if (name === 'arrayOf') {
    result.type = 'array';
    result.items = getPropertyForProp({ type: type.value });
  } else if (name === 'shape' || name === 'exact') {
    result.type = 'object';

    const {
      properties,
      required,
    } = getSchemaProperties(reduceShapeToProps(type.value));

    result.properties = properties;
    if (required.length) {
      result.required = required;
    }
  } else if (name === 'bool') {
    result.type = 'boolean';
  } else if (name === 'func') {
    // do nothing
  } else if (name === 'node') {
    // do nothing
  } else if (name === 'symbol') {
    // do nothing
  } else if (name === 'any') {
    // for no type definition, do not define type in schema
    delete result.type;
  }

  if (defaultValue) {
    try {
      const baseDefaultValue = safeEval(defaultValue.value);

      if (baseDefaultValue !== undefined) {
        result.default = baseDefaultValue;
      }
    } catch (e) {
      console.log('could not evalulate defaultValue', defaultValue.value, e.message);
    }
  }

  return result;
};

const getJSONSchema = (input = {}) => {
  const {
    props = {},
    displayName = '',
  } = input;

  const {
    properties,
    required,
  } = getSchemaProperties(props);

  const jsonSchema = {
    title: displayName,
    type: 'object',
    properties,
  };

  if (required.length) {
    jsonSchema.required = required;
  }

  return jsonSchema;
};

module.exports = (documentation, path) => {
  const flowTypesPath = getFlowTypeFromReactComponent(path);

  if (flowTypesPath) {
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
