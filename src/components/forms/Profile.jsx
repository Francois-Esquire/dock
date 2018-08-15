import React from 'react';
import PropTypes from 'prop-types';

export default class ProfileForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      handle: '',
      password: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const {
      target: { value, id },
    } = event;

    this.setState({ [id]: value });
  }

  onSubmit(event) {
    event.preventDefault();

    const { handle, password } = this.state;
    const { onSubmit } = this.props;

    if (typeof onSubmit === 'function') onSubmit({ handle, password });
  }

  render() {
    const { handle, password } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label htmlFor="handle">
            Username{' '}
            <input
              id="handle"
              type="text"
              onChange={this.onChange}
              value={handle}
            />
          </label>
        </div>

        <div>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              onChange={this.onChange}
              value={password}
            />
          </label>
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

ProfileForm.propTypes = {
  onSubmit: PropTypes.func,
};

ProfileForm.defaultProps = {
  onSubmit: undefined,
};
