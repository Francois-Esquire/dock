import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/primitives/button.scss';

export default function Button({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={[styles.button]
        .concat(className || [])
        .join(' ')
        .trim()}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

Button.defaultProps = {
  className: '',
  children: 'button',
};
