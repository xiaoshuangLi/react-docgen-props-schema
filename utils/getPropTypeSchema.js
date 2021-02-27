const safeEval = require('./safeEval');

const { getResult } = require('../utils');

const reduceShapeToProps = (shapes = {}, defaultValue = {}) => Object.keys(shapes).reduce((result, key) => {
  const { [key]: currentShape } = shapes;
  const { [key]: currentDefaultValue } = defaultValue;

  if (currentShape !== undefined) {
    const defaultResult = {
      computed: true,
      value: currentDefaultValue,
    };

    const type = currentDefaultValue === undefined
      ? currentShape
      : { defaultValue: defaultResult, ...currentShape };

    result[key] = { type };
  }

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

  const result = getResult(deepValue)({
    type: name,
  });

  if (description) {
    result.description = description;
  }

  if (alias) {
    result.format = alias;
  }

  if (params) {
    result.params = params;
  }

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
    const firstItemsDefaultValue = result.default
      ? result.default[0]
      : undefined;

    const itemsDefaultValue = firstItemsDefaultValue === undefined
      ? undefined
      : { computed: true, value: firstItemsDefaultValue };

    const currentType = itemsDefaultValue === undefined
      ? type.value
      : { ...type.value, defaultValue: itemsDefaultValue };

    const items = getPropertySchema({ type: currentType });

    result.type = 'array';
    result.items = items;
  } else if (name === 'shape' || name === 'exact') {
    result.type = 'object';

    const {
      properties,
      required,
    } = getPropertiesSchema(reduceShapeToProps(type.value, result.default));

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