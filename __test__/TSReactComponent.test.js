const parse = require('../parse');

test('bool: PropsTypes.bool', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      /**
       * boolean
       */
      bool: boolean;
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

    type Props = {
      /**
       * number
       *
       * @minimum 0
       * @maximum 10
       * @exclusiveMinimum
       * @exclusiveMaximum
       */
      number: number;
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

    type Props = {
      /**
       * string
       *
       * @minLength 0
       * @maxLength 10
       * @pattern .*
       */
      string: string;
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

    type Props = {
      /**
       * enum
       */
      enum: '1' | '2';
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

    type Props = {
      /**
       * object
       */
      object: {};
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

// TODO
test('shape: PropsTypes.shape', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      /**
       * shape
       */
      shape: {
        /**
         * string
         */
        string: string;
        /**
         * number
         */
        number: number;
      };
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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
            },
            number: {
              type: 'number',
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

    type Props = {
      /**
       * array
       */
      array: [],
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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

// TODO
test('array: PropsTypes.arrayOf', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      /**
       * array
       *
       * @minItems 0
       * @maxItems 10
       * @uniqueItems
       */
      array: [
        {
          /**
           * string
           */
          string: string;
          /**
           * number
           */
          number: number;
        },
      ];
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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
              },
              number: {
                type: 'number',
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
    import React, { ReactNode } from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      /**
       * node
       */
      node: ReactNode;
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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
    import React, { ReactNode } from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      /**
       * func
       */
      func: (value1, value2) => ReactNode,
    };

    class TSReactComponent extends Component<Props> {
      render() {
        return (
          <div {...this.props} />
        );
      }
    }

    export default TSReactComponent;
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
