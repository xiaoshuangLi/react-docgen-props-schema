const safeEval = require('../utils/safeEval');

const reduceShapeToProps = (shapes = {}) => Object.keys(shapes).reduce((result, key) => {
  result[key] = { type: shapes[key] };

  return result;
}, {});

const getPropertySchema = (curr = {}) => {
  const {
    type = {},
    value: baseDeepValue = {},
  } = curr;

  const deepValue = { ...curr, ...type, ...baseDeepValue };

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
    result.anyOf = type.value.map((subType) => getPropertySchema({ type: subType }));
    delete result.type;
  } else if (name === 'arrayOf') {
    result.type = 'array';
    result.items = getPropertySchema({ type: type.value });
  } else if (name === 'shape' || name === 'exact') {
    result.type = 'object';

    const {
      properties,
      required,
    } = getPropertiesSchema(reduceShapeToProps(type.value));

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

const getPropertiesSchema = (curr = {}) => {
  const required = [];

  const properties = Object.keys(curr).reduce((res, key) => {
    const original = curr[key];

    if (!original) {
      return res;
    }

    const { required: originalRequired } = original;

    res[key] = getPropertySchema(original);

    if (!originalRequired) {
      required.push(key);
    }

    return res;
  }, {});

  return {
    properties,
    required,
  };
};

module.exports = getPropertySchema;