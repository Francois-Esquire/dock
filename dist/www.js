'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var reactRouterDom = require('react-router-dom');
var stream = _interopDefault(require('stream'));
var server = require('react-dom/server');

var styles = {"main":"main___app"};

var styles$1 = {"article":"article___home","header":"header___home","h1":"h1___home","span":"span___home","img":"img___home","footer":"footer___home","button":"button___home"};

var styles$2 = {"button":"button___button"};

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
function Button(ref) {
  var className = ref.className;
  var children = ref.children;
  var rest = objectWithoutProperties( ref, ["className", "children"] );
  var props = rest;
  return (
    React.createElement( 'button', Object.assign({},
      { type: "button", className: [styles$2.button]
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
    React.createElement( 'article', { className: styles$1.article },
      React.createElement( 'header', { className: styles$1.header },
        React.createElement( 'h1', { className: styles$1.h1 },
          React.createElement( 'span', { className: styles$1.span }, "Find Your Obsession"),
          React.createElement( 'br', null ),
          React.createElement( 'span', { className: styles$1.span }, "Discover Your Passion")
        )
      ),
      React.createElement( 'img', { className: styles$1.img, src: simoneHutschScrape, alt: "blue skies" }),
      React.createElement( 'footer', { className: styles$1.footer },
        React.createElement( Button, { className: styles$1.button }, "Explore Now")
      )
    )
  );
}

var styles$3 = {"notfound":"notfound___404"};

function NotFound(props) {
  if (props.staticContext) { props.staticContext.status = 404; }
  return (
    React.createElement( 'section', { className: styles$3.notfound },
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
        React.createElement( reactRouterDom.Route, { component: NotFound })
      )
    );
  }
}
const Root = reactRouterDom.withRouter(Router);

class Application extends React.PureComponent {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    return (
      React.createElement( 'main', { className: styles.main },
        React.createElement( Root, null )
      )
    );
  }
}
var Application$1 = Application;

class Markup {
  constructor() {
    this.createRenderStream = this.createRenderStream.bind(this);
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
    const app = server.renderToString(
      React.createElement( reactRouterDom.StaticRouter, { location: ctx.path, context: (ctx.state = ctx.state || {}) },
        React.createElement( Application$1, null )
      )
    );
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
          React.createElement( 'div', { id: "app", dangerouslySetInnerHTML: { __html: app } })
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
