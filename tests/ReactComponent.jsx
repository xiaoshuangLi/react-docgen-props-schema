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