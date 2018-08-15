import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles/modal.scss';

const { Provider, Consumer } = React.createContext({
  open: () => undefined,
  close: () => undefined,
});

export { Consumer };

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, Component: null };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.modal = document.createElement('div', {
      id: 'modal',
    });
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    document.body.appendChild(this.modal);
  }

  componentWillUnmount() {
    document.body.removeChild(this.modal);
  }

  open(Component) {
    if (Component) this.setState({ isOpen: true, Component });
  }

  close() {
    this.setState({
      isOpen: false,
      Component: null,
    });
  }

  render() {
    const {
      open,
      close,
      props: { children },
      state: { isOpen, Component },
    } = this;

    const api = {
      open,
      close,
    };

    return (
      <>
        <Provider value={api}>{children}</Provider>

        {isOpen &&
          ReactDOM.createPortal(
            <div className={styles.content}>
              {typeof Component === 'function'
                ? React.createElement(Component, api)
                : React.cloneElement(Component, api)}
            </div>,
            this.modal,
          )}
      </>
    );
  }
}
