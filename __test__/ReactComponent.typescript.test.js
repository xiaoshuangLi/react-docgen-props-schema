const parse = require('../parse');

describe('Typescript', () => {
  test('bool: PropTypes.bool', () => {
    const code = `
      import React from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * boolean
         */
        bool: boolean;
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('number: PropTypes.number', () => {
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

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('string: PropTypes.string', () => {
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

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('enum: PropTypes.oneOf', () => {
    const code = `
      import React from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * enum
         */
        enum: '1' | '2';
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('object: PropTypes.object', () => {
    const code = `
      import React from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * object
         */
        object: {};
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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
  test('shape: PropTypes.shape', () => {
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

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('array: PropTypes.array', () => {
    const code = `
      import React from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * array
         */
        array: [],
        /**
         * strings
         */
        strings: string[],
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
    `;

    const expected = {
      propsSchema: {
        properties: {
          array: {
            type: 'array',
            description: 'array',
          },
          strings: {
            type: 'array',
            description: 'strings',
            items: { type: 'string' },
          },
        },
      },
    };

    const actual = parse(code) || {};

    expect(actual).toMatchObject(expected);
  });

  // TODO
  test('array: PropTypes.arrayOf', () => {
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

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('node: PropTypes.node', () => {
    const code = `
      import React, { ReactNode } from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * node
         */
        node: ReactNode;
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
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

  test('func: PropTypes.func', () => {
    const code = `
      import React, { ReactNode } from 'react';
      import PropTypes from 'prop-types';

      type Props = {
        /**
         * func
         */
        func: (value1, value2) => ReactNode,
      };

      class ReactComponent extends Component<Props> {
        render() {
          return (
            <div {...this.props} />
          );
        }
      }

      export default ReactComponent;
    `;

    const expected = {
      propsSchema: {
        properties: {
          func: {
            type: 'func',
            description: 'func',
            params: ['value1', 'value2'],
            return: { type: 'node' },
          },
        },
      },
    };

    const actual = parse(code) || {};

    expect(actual).toMatchObject(expected);
  });
});
