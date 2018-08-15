'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var PropTypes = _interopDefault(require('prop-types'));
var reactApollo = require('react-apollo');
var reactRouterDom = require('react-router-dom');
var stream = _interopDefault(require('stream'));
var server = require('react-dom/server');
var apolloClient = require('apollo-client');
var apolloCacheInmemory = require('apollo-cache-inmemory');
var apolloLinkSchema = require('apollo-link-schema');

var styles = {"toaster":"toaster___toaster"};

const { Provider, Consumer } = React.createContext({
  notify: () => undefined,
  dismiss: () => undefined,
});
class Toaster extends React.PureComponent {
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
    const message = Object.assign({}, msg,
      {id: messages.length});
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
      React.createElement( React.Fragment, null,
        React.createElement( Provider, { value: api }, children),
        React.createElement( 'ul', { className: styles.toaster },
          messages.map(m => (
            React.createElement( 'li', { key: m.message },
              React.createElement( 'p', null, m.message ),
              React.createElement( 'button', { type: "button", onClick: () => dismiss(m.id) }, "Dismiss")
            )
          ))
        )
      )
    );
  }
}

var styles$1 = {"content":"content___modal"};

const { Provider: Provider$1, Consumer: Consumer$1 } = React.createContext({
  open: () => undefined,
  close: () => undefined,
});
class Modal extends React.Component {
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
    document.body.appendChild(this.modal);
  }
  componentWillUnmount() {
    document.body.removeChild(this.modal);
  }
  open(Component) {
    if (Component) { this.setState({ isOpen: true, Component }); }
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
      React.createElement( React.Fragment, null,
        React.createElement( Provider$1, { value: api }, children),
        isOpen &&
          ReactDOM.createPortal(
            React.createElement( 'div', { className: styles$1.content },
              typeof Component === 'function'
                ? React.createElement(Component, api)
                : React.cloneElement(Component, api)
            ),
            this.modal
          )
      )
    );
  }
}

var styles$2 = {"main":"main___main"};

var styles$3 = {"header":"header___header"};

function Header() {
  return (
    React.createElement( 'header', { className: styles$3.header },
      React.createElement( 'p', null, "Main Header" )
    )
  );
}

var styles$4 = {"footer":"footer___footer"};

function Footer() {
  return (
    React.createElement( 'footer', { className: styles$4.footer },
      React.createElement( 'p', null, "Main Footer" )
    )
  );
}

var styles$5 = {"article":"article___home","header":"header___home","h1":"h1___home","span":"span___home","img":"img___home","footer":"footer___home","button":"button___home"};

var styles$6 = {"button":"button___button"};

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
function Button(ref) {
  var className = ref.className;
  var children = ref.children;
  var rest = objectWithoutProperties( ref, ["className", "children"] );
  var props = rest;
  return (
    React.createElement( 'button', Object.assign({},
      { type: "button", className: [styles$6.button]
        .concat(className || [])
        .join(' ')
        .trim() }, props),
      children
    )
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

var simoneHutschScrape = "/assets/simone-hutsch-scrape.jpg";

function Home() {
  return (
    React.createElement( 'article', { className: styles$5.article },
      React.createElement( 'header', { className: styles$5.header },
        React.createElement( 'h1', { className: styles$5.h1 },
          React.createElement( 'span', { className: styles$5.span }, "Find Your Obsession"),
          React.createElement( 'br', null ),
          React.createElement( 'span', { className: styles$5.span }, "Discover Your Passion")
        )
      ),
      React.createElement( 'img', { className: styles$5.img, src: simoneHutschScrape, alt: "blue skies" }),
      React.createElement( 'footer', { className: styles$5.footer },
        React.createElement( Consumer, null,
          toaster => (
            React.createElement( Button, {
              className: styles$5.button, onClick: () => toaster.notify({ message: 'go exploring' }) }, "Explore Now")
          )
        )
      )
    )
  );
}

var doc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NodeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Node"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":52}};
    doc.loc.source = {"body":"fragment NodeFragment on Node {\n  __typename\n  id\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

var doc$1 = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NodeFragment"},"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"handle"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":83}};
    doc$1.loc.source = {"body":"#import \"./node.gql\"\n\nfragment UserFragment on User {\n  ...NodeFragment\n  handle\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names$1 = {};
    function unique$1(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') { return true; }
          var name = def.name.value;
          if (names$1[name]) {
            return false;
          } else {
            names$1[name] = true;
            return true;
          }
        }
      )
    }
  doc$1.definitions = doc$1.definitions.concat(unique$1(doc.definitions));

var doc$2 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"},"directives":[]}]}}]}}],"loc":{"start":0,"end":82}};
    doc$2.loc.source = {"body":"#import \"../fragments/node.user.gql\"\n\nquery Me {\n  me {\n    ...UserFragment\n  }\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names$2 = {};
    function unique$2(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') { return true; }
          var name = def.name.value;
          if (names$2[name]) {
            return false;
          } else {
            names$2[name] = true;
            return true;
          }
        }
      )
    }
  doc$2.definitions = doc$2.definitions.concat(unique$2(doc$1.definitions));


    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc$2.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set(opRefs);
      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        module.exports["Me"] = oneQuery(doc$2, "Me");

function QueryMe(ref) {
  var children = ref.children;
  return React.createElement( reactApollo.Query, { query: doc$2 }, children);
}

var doc$3 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pass"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pass"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pass"}}},{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}}],"directives":[]}]}}],"loc":{"start":0,"end":103}};
    doc$3.loc.source = {"body":"mutation ChangePassword($pass: String!, $word: String!) {\n  changePassword(pass: $pass, word: $word)\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences$1(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences$1(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences$1(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences$1(def, refs);
        });
      }
    }

    var definitionRefs$1 = {};
    (function extractReferences() {
      doc$3.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences$1(def, refs);
          definitionRefs$1[def.name.value] = refs;
        }
      });
    })();

    function findOperation$1(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery$1(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation$1(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs$1[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set(opRefs);
      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs$1[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation$1(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        module.exports["ChangePassword"] = oneQuery$1(doc$3, "ChangePassword");

var doc$4 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeHandle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"handle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeHandle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"handle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"handle"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"},"directives":[]}]}}]}}],"loc":{"start":0,"end":140}};
    doc$4.loc.source = {"body":"#import \"../fragments/node.user.gql\"\n\nmutation ChangeHandle($handle: String!) {\n  changeHandle(handle: $handle) {\n    ...UserFragment\n  }\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names$4 = {};
    function unique$4(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') { return true; }
          var name = def.name.value;
          if (names$4[name]) {
            return false;
          } else {
            names$4[name] = true;
            return true;
          }
        }
      )
    }
  doc$4.definitions = doc$4.definitions.concat(unique$4(doc$1.definitions));


    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences$2(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences$2(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences$2(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences$2(def, refs);
        });
      }
    }

    var definitionRefs$2 = {};
    (function extractReferences() {
      doc$4.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences$2(def, refs);
          definitionRefs$2[def.name.value] = refs;
        }
      });
    })();

    function findOperation$2(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery$2(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation$2(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs$2[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set(opRefs);
      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs$2[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation$2(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        module.exports["ChangeHandle"] = oneQuery$2(doc$4, "ChangeHandle");

var doc$5 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"},"directives":[]}]}}]}}],"loc":{"start":0,"end":130}};
    doc$5.loc.source = {"body":"#import \"../fragments/node.user.gql\"\n\nmutation Login($profile: Profile!) {\n  login(profile: $profile) {\n    ...UserFragment\n  }\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names$5 = {};
    function unique$5(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') { return true; }
          var name = def.name.value;
          if (names$5[name]) {
            return false;
          } else {
            names$5[name] = true;
            return true;
          }
        }
      )
    }
  doc$5.definitions = doc$5.definitions.concat(unique$5(doc$1.definitions));


    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences$3(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences$3(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences$3(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences$3(def, refs);
        });
      }
    }

    var definitionRefs$3 = {};
    (function extractReferences() {
      doc$5.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences$3(def, refs);
          definitionRefs$3[def.name.value] = refs;
        }
      });
    })();

    function findOperation$3(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery$3(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation$3(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs$3[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set(opRefs);
      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs$3[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation$3(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        module.exports["Login"] = oneQuery$3(doc$5, "Login");

var doc$6 = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"},"directives":[]}]}}]}}],"loc":{"start":0,"end":132}};
    doc$6.loc.source = {"body":"#import \"../fragments/node.user.gql\"\n\nmutation Signup($profile: Profile!) {\n  signup(profile: $profile) {\n    ...UserFragment\n  }\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names$6 = {};
    function unique$6(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') { return true; }
          var name = def.name.value;
          if (names$6[name]) {
            return false;
          } else {
            names$6[name] = true;
            return true;
          }
        }
      )
    }
  doc$6.definitions = doc$6.definitions.concat(unique$6(doc$1.definitions));


    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences$4(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences$4(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences$4(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences$4(def, refs);
        });
      }
    }

    var definitionRefs$4 = {};
    (function extractReferences() {
      doc$6.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences$4(def, refs);
          definitionRefs$4[def.name.value] = refs;
        }
      });
    })();

    function findOperation$4(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery$4(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation$4(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs$4[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set(opRefs);
      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs$4[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation$4(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
        module.exports["Signup"] = oneQuery$4(doc$6, "Signup");



var mutationDocuments = /*#__PURE__*/Object.freeze({
  changePassword: doc$3,
  changeHandle: doc$4,
  login: doc$5,
  signup: doc$6
});

const client = { mutate: () => undefined };
const mutations = Object.keys(mutationDocuments).reduce(
  function mutationFactory(map, next) {
    map[next] = function mutationSignature(options = {}) {
      return client.mutate(Object.assign({}, options,
        {mutation: mutationDocuments[next]}));
    };
    return map;
  },
  Object.create(null)
);
const { Consumer: Consumer$2 } = React.createContext(mutations);

class ProfileForm extends React.PureComponent {
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
    var obj;
    const {
      target: { value, id },
    } = event;
    this.setState(( obj = {}, obj[id] = value, obj ));
  }
  onSubmit(event) {
    event.preventDefault();
    const { handle, password } = this.state;
    const { onSubmit } = this.props;
    if (typeof onSubmit === 'function') { onSubmit({ handle, password }); }
  }
  render() {
    const { handle, password } = this.state;
    return (
      React.createElement( 'form', { onSubmit: this.onSubmit },
        React.createElement( 'div', null,
          React.createElement( 'label', { htmlFor: "handle" }, "Username", ' ',
            React.createElement( 'input', {
              id: "handle", type: "text", onChange: this.onChange, value: handle })
          )
        ),
        React.createElement( 'div', null,
          React.createElement( 'label', { htmlFor: "password" }, "Password ", React.createElement( 'input', {
              id: "password", type: "password", onChange: this.onChange, value: password })
          )
        ),
        React.createElement( 'div', null,
          React.createElement( 'button', { type: "submit" }, "Submit")
        )
      )
    );
  }
}
ProfileForm.propTypes = {
  onSubmit: PropTypes.func,
};
ProfileForm.defaultProps = {
  onSubmit: undefined,
};

function LoginPage() {
  return (
    React.createElement( QueryMe, null,
      (ref) =>
        {
          var data = ref.data;
          return data.me ? (
          React.createElement( reactRouterDom.Redirect, { to: "/" })
        ) : (
          React.createElement( 'section', null,
            React.createElement( Consumer$2, null,
              mutate => (
                React.createElement( Consumer, null,
                  toaster => (
                    React.createElement( ProfileForm, {
                      onSubmit: (ref) =>
                        {
                          var handle = ref.handle;
                          var password = ref.password;
                          return mutate
                          .login({
                            variables: {
                              profile: {
                                handle,
                                password,
                              },
                            },
                            updateQueries: [
                              {
                                me: (prev, ref) => {
                                  var mutationResult = ref.mutationResult;
                                  console.log(prev, mutationResult);
                                  return {
                                    me: mutationResult.data.signup,
                                  };
                                },
                              } ],
                          })
                          .then(results =>
                            toaster.notify({
                              message: `Successfully logged in as ${
                                results.data.login.handle
                              }`,
                            })
                          );
                    } })
                  )
                )
              )
            )
          )
        );
  }
    )
  );
}

function SignupPage() {
  return (
    React.createElement( QueryMe, null,
      (ref) =>
        {
          var data = ref.data;
          return data.me ? (
          React.createElement( reactRouterDom.Redirect, { to: "/" })
        ) : (
          React.createElement( 'section', null,
            React.createElement( Consumer$2, null,
              mutate => (
                React.createElement( ProfileForm, {
                  onSubmit: (ref) =>
                    {
                      var handle = ref.handle;
                      var password = ref.password;
                      return mutate.signup({
                      variables: {
                        profile: {
                          handle,
                          password,
                        },
                      },
                      updateQueries: {
                        me: (prev, ref) => {
                          var mutationResult = ref.mutationResult;
                          return ({
                          me: mutationResult.data.signup,
                        });
                      },
                      },
                    });
                } })
              )
            )
          )
        );
  }
    )
  );
}

var styles$7 = {"profile":"profile___profile"};

function ProfileView(props) {
  const { me } = props;
  return (
    React.createElement( 'article', { className: styles$7.profile },
      React.createElement( 'header', null,
        React.createElement( 'h2', null, me.handle )
      )
    )
  );
}

function ProfilePage() {
  return (
    React.createElement( 'section', null,
      React.createElement( QueryMe, null,
        data =>
          data.me ? React.createElement( ProfileView, { me: data.me }) : React.createElement( reactRouterDom.Redirect, { to: "/login" })
      )
    )
  );
}

var styles$8 = {"notfound":"notfound___404"};

function NotFound(props) {
  if (props.staticContext) { props.staticContext.status = 404; }
  return (
    React.createElement( 'section', { className: styles$8.notfound },
      React.createElement( 'header', null,
        React.createElement( 'h1', null, "Sorry" )
      ),
      React.createElement( 'p', null, "Looks like we couldn", "'", "t find what you were looking for." ),
      React.createElement( 'footer', null,
        React.createElement( reactRouterDom.Link, { to: "/" }, "Go Back Home")
      )
    )
  );
}

class Router extends React.PureComponent {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    return (
      React.createElement( reactRouterDom.Switch, null,
        React.createElement( reactRouterDom.Route, { exact: true, path: "/", component: Home }),
        React.createElement( reactRouterDom.Route, { path: "/login", component: LoginPage }),
        React.createElement( reactRouterDom.Route, { path: "/signup", component: SignupPage }),
        React.createElement( reactRouterDom.Route, { path: "/me", component: ProfilePage }),
        React.createElement( reactRouterDom.Route, { component: NotFound })
      )
    );
  }
}
const Root = reactRouterDom.withRouter(Router);

function MainLayout() {
  return (
    React.createElement( 'main', { className: styles$2.main },
      React.createElement( Header, null ),
      React.createElement( Root, null ),
      React.createElement( Footer, null )
    )
  );
}

class Application extends React.PureComponent {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    return (
      React.createElement( Toaster, null,
        React.createElement( Modal, null,
          React.createElement( MainLayout, null )
        )
      )
    );
  }
}
var Application$1 = Application;

const schema = require('./schema');
class Markup {
  constructor() {
    this.createRenderStream = this.createRenderStream.bind(this);
    const link = new apolloLinkSchema.SchemaLink({ schema, context: null, rootValue: null });
    const cache = new apolloCacheInmemory.InMemoryCache();
    this.client = new apolloClient.ApolloClient({ ssrMode: true, link, cache });
  }
  createRenderStream(html) {
    const body = new stream.Transform({
      transform(chunk, encoding, callback) {
        callback(undefined, chunk);
      },
    });
    body.write('<!DOCTYPE html>');
    return server.renderToStaticNodeStream(html).pipe(body);
  }
  error(ctx, error) {
    ctx.status = error.code || (error.code = 500);
    const html = (
      React.createElement( 'html', { lang: "en-US" },
        React.createElement( 'head', null,
          React.createElement( 'meta', { charSet: "utf-8" }),
          React.createElement( 'meta', { httpEquiv: "Content-Language", content: "en" }),
          React.createElement( 'meta', { name: "viewport", content: "width=device-width, initial-scale=1" }),
          React.createElement( 'title', null, "Oops - ", error.code )
        ),
        React.createElement( 'body', null,
          React.createElement( 'p', null, "We", "'", "re sorry, looks like there was an issue..." ),
          React.createElement( 'p', null, error.message )
        )
      )
    );
    return this.createRenderStream(html);
  }
  async render(ctx) {
    const { client } = this;
    client.cache.reset();
    client.link = new apolloLinkSchema.SchemaLink({
      schema,
      context: ctx,
      rootValue: ctx.state,
    });
    const _ = (
      React.createElement( reactApollo.ApolloProvider, { client: client },
        React.createElement( reactRouterDom.StaticRouter, {
          location: ctx.path, context: (ctx.state = ctx.state || {}) },
          React.createElement( Application$1, null )
        )
      )
    );
    await reactApollo.getDataFromTree(_);
    const state = {
      __$$__: client.extract(),
    };
    const app = server.renderToString(_);
    if (typeof ctx.state.status === 'number') { ctx.status = ctx.state.status; }
    else { ctx.status = 200; }
    const html = (
      React.createElement( 'html', { lang: "en-US" },
        React.createElement( 'head', null,
          React.createElement( 'meta', { charSet: "utf-8" }),
          React.createElement( 'meta', { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
          React.createElement( 'meta', { httpEquiv: "Content-Language", content: "en" }),
          React.createElement( 'meta', { name: "viewport", content: "width=device-width, initial-scale=1" }),
          React.createElement( 'title', null, "Discover Your Passion" )
                   ,
          React.createElement( 'link', { rel: "stylesheet", href: "/css/main.css" })
        ),
        React.createElement( 'body', null
                                                        ,
          React.createElement( 'div', { id: "app", dangerouslySetInnerHTML: { __html: app } }),
          React.createElement( 'script', {
            dangerouslySetInnerHTML: {
              __html: Object.keys(state).map(
                key =>
                  `window.${key}=${JSON.stringify(state[key]).replace(
                    /</g,
                    '\\u003c'
                  )};`
              ),
            } })
                  ,
          React.createElement( 'script', { type: "text/javascript", src: "/js/vendors~main.js" }),
          React.createElement( 'script', { type: "text/javascript", src: "/js/main.js" })
        )
      )
    );
    return this.createRenderStream(html);
  }
}
var index = new Markup();

module.exports = index;
