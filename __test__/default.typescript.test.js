const parse = require('../parse');

test('simple value attribute', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      bool: boolean;
      number: number;
      string: string;
    };

    class ReactComponent extends Component<Props> {
      defaultProps = {
        bool: false,
        number: 0,
        string: 'string',
      };

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
          default: false,
        },
        number: {
          type: 'number',
          default: 0,
        },
        string: {
          type: 'string',
          default: 'string',
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});

test('complex value attribute', () => {
  const code = `
    import React from 'react';
    import PropTypes from 'prop-types';

    type Props = {
      object: {};
      shape: {
        bool: boolean;
        number: number;
        string: string;
      };
      array: [];
      arrayShape: [{
        bool: boolean;
        number: number;
        string: string;
      }];
    };

    class ReactComponent extends Component<Props> {
      defaultProps = {
        object: {},
        shape: {
          bool: false,
          number: 0,
          string: 'string',
        },
        array: [],
        arrayShape: [{
          bool: false,
          number: 0,
          string: 'string',
        }],
      };

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
          default: {},
        },
        shape: {
          type: 'object',
          properties: {
            bool: {
              type: 'boolean',
              default: false,
            },
            number: {
              type: 'number',
              default: 0,
            },
            string: {
              type: 'string',
              default: 'string',
            },
          },
          default: {
            bool: false,
            number: 0,
            string: 'string',
          },
        },
        array: {
          type: 'array',
          default: [],
        },
        arrayShape: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bool: {
                type: 'boolean',
                default: false,
              },
              number: {
                type: 'number',
                default: 0,
              },
              string: {
                type: 'string',
                default: 'string',
              },
            },
            default: {
              bool: false,
              number: 0,
              string: 'string',
            },
          },
          default: [{
            bool: false,
            number: 0,
            string: 'string',
          }],
        },
      },
    },
  };

  const actual = parse(code) || {};

  expect(actual).toMatchObject(expected);
});
