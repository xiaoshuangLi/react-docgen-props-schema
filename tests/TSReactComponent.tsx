import React, { Component } from 'react';
import PropTypes from 'prop-types';

interface BaseProps {
  /**
   * class for component
   */
  className?: string;
  /**
   * size for component
   */
  size: 'sm' | 'md' | 'lg';
  /**
   * object for component
   */
  object: {
    value: number;
    label: number;
  };
  /**
   * array for component
   */
  array: [
    {
      value?: number;
      label: number;
    }
  ];
}

type Props = BaseProps & {
  /**
   * value for component
   * @alias date-time
   */
  value: string;
  /**
   * onChange for component
   * @function
   * @name onChange
   * @param {string} value - value for component
   */
  onChange: (value: string) => void;
};

class TSReactComponent extends Component<Props> {
  static propsTypes: {
    onChange: PropTypes.func,
  };
  render() {
    const { value, onChange, className, ...others } = this.props;

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
  }
}

export default TSReactComponent;