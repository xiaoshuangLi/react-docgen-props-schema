const parse = require('../parse');

test('bool: PropsTypes.bool', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * boolean
       */
      bool: PropTypes.bool,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        bool: {
          type: 'boolean',
          description: 'boolean',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('number: PropsTypes.number', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * number
       *
       * @minimum 0
       * @maximum 10
       * @exclusiveMinimum
       * @exclusiveMaximum
       */
      number: PropTypes.number,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        number: {
          type: 'number',
          description: 'number',
          minimum: 0,
          maximum: 10,
          exclusiveMinimum: true,
          exclusiveMaximum: true,
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('string: PropsTypes.string', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * string
       *
       * @minLength 0
       * @maxLength 10
       * @pattern .*
       */
      string: PropTypes.string,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        string: {
          type: 'string',
          description: 'string',
          minLength: 0,
          maxLength: 10,
          pattern: '.*'
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('enum: PropsTypes.oneOf', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * enum
       */
      enum: PropTypes.oneOf(['1', '2']),
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        enum: {
          type: 'string',
          description: 'enum',
          enum: ['1', '2'],
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('object: PropsTypes.object', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * object
       */
      object: PropTypes.object,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        object: {
          type: 'object',
          description: 'object',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('shape: PropsTypes.shape', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * shape
       */
      shape: PropTypes.shape({
        /**
         * string
         */
        string: PropTypes.string,
        /**
         * number
         */
        number: PropTypes.number,
      }),
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        shape: {
          type: 'object',
          description: 'shape',
          properties: {
            string: {
              type: 'string',
              description: 'string',
            },
            number: {
              type: 'number',
              description: 'number',
            },
          },
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('array: PropsTypes.array', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * array
       */
      array: PropTypes.array,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        array: {
          type: 'array',
          description: 'array',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('array: PropsTypes.arrayOf', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * array
       *
       * @minItems 0
       * @maxItems 10
       * @uniqueItems
       */
      array: PropTypes.arrayOf(
        PropTypes.shape({
          /**
           * string
           */
          string: PropTypes.string,
          /**
           * number
           */
          number: PropTypes.number,
        }),
      ),
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        array: {
          type: 'array',
          description: 'array',
          minItems: 0,
          maxItems: 10,
          uniqueItems: true,
          items: {
            type: 'object',
            properties: {
              string: {
                type: 'string',
                description: 'string',
              },
              number: {
                type: 'number',
                description: 'number',
              },
            }
          },
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('node: PropsTypes.node', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * node
       */
      node: PropTypes.node,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        node: {
          type: 'node',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('func: PropsTypes.func', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    const ReactComonent = React.forwardRef(
      (props = {}, ref) => (<div ref={ref} {...props}/>)
    );

    ReactComonent.propTypes = {
      /**
       * func
       *
       * @param value1
       * @param value2
       * @return node
       */
      func: PropTypes.func,
    };

    export default ReactComonent;
  `;

  const expected = {
    propsSchema: {
      properties: {
        func: {
          type: 'func',
          description: 'func',
          params: ['value1', 'value2'],
          return: 'node',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

// TODO
// test('string: PropsTypes.string.isRequired', () => {
//   const code = `
//     import React from 'react';
//     import PropTypes from 'prop-types';
// 
//     const ReactComonent = React.forwardRef(
//       (props = {}, ref) => (<div ref={ref} {...props}/>)
//     );
// 
//     ReactComonent.propTypes = {
//       string: PropsTypes.string.isRequired,
//     };
// 
//     export default ReactComonent;
//   `;
// 
//   const expected = {
//     propsSchema: {
//       properties: {
//         string: {
//           type: 'string',
//           description: 'string',
//         },
//       },
//       required: ['string'],
//     },
//   };
// 
//   const actual = parse(code) || {};
// 
//   console.log(actual.props);
// 
//   expect(actual).toMatchObject(expected);
// });