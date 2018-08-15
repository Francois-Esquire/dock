import React from 'react';

import styles from './styles/toaster.scss';

const { Provider, Consumer } = React.createContext({
  notify: () => undefined,
  dismiss: () => undefined,
});

export { Consumer };

export default class Toaster extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.notify = this.notify.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  _create(msg) {
    const { messages } = this.state;

    const message = {
      ...msg,
      id: messages.length,
    };

    return message;
  }

  _queue(msg) {
    const { messages } = this.state;

    messages.push(this._create(msg));

    this.setState({ messages });
  }

  _destroy(id) {
    const { messages } = this.state;

    messages.splice(id, 1);

    this.setState({ messages });
  }

  notify(msg) {
    this._queue(msg);
  }

  dismiss(id) {
    this._destroy(id);
  }

  render() {
    const {
      notify,
      dismiss,
      props: { children },
      state: { messages },
    } = this;

    const api = {
      notify,
      dismiss,
    };

    return (
      <>
        <Provider value={api}>{children}</Provider>

        <ul className={styles.toaster}>
          {messages.map(m => (
            <li key={m.message}>
              <p>{m.message}</p>

              <button type="button" onClick={() => dismiss(m.id)}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
