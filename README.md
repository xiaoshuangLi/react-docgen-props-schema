# react-docgen-props-schema

> Converts [react-docgen]((https://github.com/reactjs/react-docgen)) output to [JSON Schema](http://json-schema.org).

## Install

```bash
npm install --save react-docgen-props-schema
```

## Usage

Take this example React component.

```js
import React from 'react';
import PropTypes from 'prop-types';

const ReactComonent = React.forwardRef((props = {}, ref) => {
  const { value, onChange, className, ...others } = props;

  return (
    <input
      type="date"
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
      {...others}
    />
  );
});

ReactComonent.propTypes = {
  /**
   * class for component
   */
  className: PropTypes.string,
  /**
   * size for component
   */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /**
   * value for component
   * @alias date-time
   */
  value: PropTypes.string,
  /**
   * onChange for component
   * @function
   * @name onChange
   * @param {string} value - value for component
   */
  onChange: PropTypes.func,
  /**
   * object for component
   */
  object: PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
  }),
  /**
   * array for component
   */
  array: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    }),
  ),
};

export default ReactComonent;
```

`react-docgen-props-schema` generates the following JSON:

```js
{
  "description": "",
  "methods": [],
  "props": {
    "className": {
      "type": {
        "name": "string"
      },
      "required": false,
      "description": "class for component"
    },
    "size": {
      "type": {
        "name": "enum",
        "value": [
          {
            "value": "'sm'",
            "computed": false
          },
          {
            "value": "'md'",
            "computed": false
          },
          {
            "value": "'lg'",
            "computed": false
          }
        ]
      },
      "required": false,
      "description": "size for component"
    },
    "value": {
      "type": {
        "name": "string"
      },
      "required": false,
      "description": "value for component",
      "alias": "date-time"
    },
    "onChange": {
      "type": {
        "name": "func"
      },
      "required": false,
      "description": "onChange for component",
      "params": [
        "value"
      ]
    },
    "object": {
      "type": {
        "name": "shape",
        "value": {
          "value": {
            "name": "number",
            "required": false
          },
          "label": {
            "name": "string",
            "required": false
          }
        }
      },
      "required": false,
      "description": "object for component"
    },
    "array": {
      "type": {
        "name": "arrayOf",
        "value": {
          "name": "shape",
          "value": {
            "value": {
              "name": "number",
              "required": false
            },
            "label": {
              "name": "string",
              "required": false
            }
          }
        }
      },
      "required": false,
      "description": "array for component"
    }
  },
  "propsSchema": {
    "title": "",
    "type": "object",
    "properties": {
      "className": {
        "type": "string",
        "description": "class for component"
      },
      "size": {
        "type": "string",
        "description": "size for component",
        "enum": [
          "sm",
          "md",
          "lg"
        ]
      },
      "value": {
        "type": "string",
        "description": "value for component",
        "format": "date-time"
      },
      "onChange": {
        "type": "func",
        "description": "onChange for component",
        "params": [
          "value"
        ]
      },
      "object": {
        "type": "object",
        "description": "object for component",
        "properties": {
          "value": {
            "type": "number"
          },
          "label": {
            "type": "string"
          }
        }
      },
      "array": {
        "type": "array",
        "description": "array for component",
        "items": {
          "type": "object",
          "properties": {
            "value": {
              "type": "number"
            },
            "label": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```

## Status

-   [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)
-   [x] PropTypes.array
-   [x] PropTypes.bool
-   [x] PropTypes.func
-   [x] PropTypes.number
-   [x] PropTypes.object
-   [x] PropTypes.string
-   [x] PropTypes.symbol
-   [x] PropTypes.node
-   [ ] PropTypes.element
-   [ ] PropTypes.instanceOf
-   [x] PropTypes.oneOf (enums)
-   [ ] PropTypes.oneOfType (unions)
-   [x] PropTypes.arrayOf
-   [ ] PropTypes.objectOf
-   [x] PropTypes.shape
-   [ ] PropTypes.any
-   [x] PropTypes isRequired
-   [ ] PropTypes custom function
-   [x] PropTypes default values

## Related

-   [JSON Schema](http://json-schema.org) - Official JSON Schema spec.
-   [React Docgen](https://github.com/reactjs/react-docgen) - Extracts docs from React source files.

## License

MIT © [Hydrate](https://github.com/hydrateio)
