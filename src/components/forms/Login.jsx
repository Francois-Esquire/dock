import React from 'react';
import PropTypes from 'prop-types';

export default class LoginForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
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

    const { username, password } = this.state;
    const { onSubmit } = this.props;

    if (typeof onSubmit === 'function') onSubmit({ username, password });
  }

  render() {
    const { username, password } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            onChange={this.onChange}
            value={username}
          />
        </div>

        <div>
          <label htmlFor="password">Username</label>
          <input
            id="password"
            type="password"
            onChange={this.onChange}
            value={password}
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};

LoginForm.defaultProps = {
  onSubmit: undefined,
};
