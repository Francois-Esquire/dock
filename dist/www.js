'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var server = require('react-dom/server');
var reactRouterDom = require('react-router-dom');
var PropTypes = _interopDefault(require('prop-types'));

function Button(ref) {
  var children = ref.children;
  var rest = {}; for (var n in ref) if(["children"].indexOf(n) === -1) rest[n] = ref[n];
  var props = rest;

  return React.createElement( 'button', props, children);
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

Button.defaultProps = {
  children: 'button',
};

const styles = {
  article: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'scroll',
    fontFamily: 'futura',
  },
  header: {
    zIndex: 2,
    minHeight: '400px',
    padding: '4em',
  },
  h1: {
    textAlign: 'center',
    fontSize: '2em',
    color: '#fff',
  },
  span: {
    padding: '1em',
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    zIndex: 1,
    overflow: 'scroll',
  },
  footer: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    zIndex: 2,
    padding: '2em',
  },
  button: {
    fontFamily: 'futura',
    fontSize: '3em',
    background: 'none',
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: 4,
    margin: 'auto',
    padding: '2em',
  },
};

function Home() {
  return (
    React.createElement( 'article', { style: styles.article },
      React.createElement( 'header', { style: styles.header },
        React.createElement( 'h1', { style: styles.h1 },
          React.createElement( 'span', { style: styles.span }, "Find Your Obsession"),
          React.createElement( 'br', null ),
          React.createElement( 'span', { style: styles.span }, "Discover Your Passion")
        )
      ),

      React.createElement( 'img', {
        style: styles.img, src: "assets/simone-hutsch-scrape.jpg", alt: "blue skies" }),

      React.createElement( 'footer', { style: styles.footer },
        React.createElement( Button, { style: styles.button }, "Explore Now")
      )
    )
  );
}

function Application() {
  return (
    React.createElement( 'main', null,
      React.createElement( reactRouterDom.Switch, null,
        React.createElement( reactRouterDom.Route, { component: Home })
      )
    )
  );
}

const App = reactRouterDom.withRouter(Application);

async function render(ctx) {
  const app = (
    React.createElement( reactRouterDom.StaticRouter, { location: ctx.path, context: ctx },
      React.createElement( App, null )
    )
  );

  const html = (
    React.createElement( 'html', { lang: "en-US" },
      React.createElement( 'head', null,
        React.createElement( 'meta', { charSet: "utf-8" }),
        React.createElement( 'meta', { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
        React.createElement( 'meta', { httpEquiv: "Content-Language", content: "en" }),
        React.createElement( 'meta', { name: "viewport", content: "width=device-width, initial-scale=1" }),
        React.createElement( 'title', null, "Shiva" )
      ),
      React.createElement( 'body', null,
        React.createElement( 'div', {
          id: "app", dangerouslySetInnerHTML: { __html: server.renderToString(app) } }),
        React.createElement( 'script', { src: "/js/manifest.js" }),
        React.createElement( 'script', { src: "/js/vendor.js" }),
        React.createElement( 'script', { src: "/js/main.js" })
      )
    )
  );

  const body = `<!DOCTYPE html>${server.renderToStaticMarkup(html)}`;

  return body;
}

module.exports = render;
