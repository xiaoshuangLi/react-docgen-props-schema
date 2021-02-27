const parse = require('../parse');

describe('Javascript', () => {
  test('simple value attribute', () => {
    const code = `
      import React from 'react';
      import PropTypes from 'prop-types';

      const ReactComonent = React.forwardRef(
        (props = {}, ref) => (<div ref={ref} {...props}/>)
      );

      ReactComonent.propTypes = {
        bool: PropTypes.bool,
        number: PropTypes.number,
        string: PropTypes.string,
      };

      ReactComonent.defaultProps = {
        bool: false,
        number: 0,
        string: 'string',
      };

      export default ReactComonent;
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

      const ReactComonent = React.forwardRef(
        (props = {}, ref) => (<div ref={ref} {...props}/>)
      );

      ReactComonent.propTypes = {
        object: PropTypes.object,
        shape: PropTypes.shape({
          bool: PropTypes.bool,
          number: PropTypes.number,
          string: PropTypes.string,
        }),
        array: PropTypes.array,
        arrayShape: PropTypes.arrayOf(
          PropTypes.shape({
            bool: PropTypes.bool,
            number: PropTypes.number,
            string: PropTypes.string,
          }),
        ),
      };

      ReactComonent.defaultProps = {
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

      export default ReactComonent;
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
});
