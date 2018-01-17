'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var server = require('react-dom/server');
var reactRouterDom = require('react-router-dom');

const Home = () => (
    React.createElement( 'article', null,
        React.createElement( 'header', null,
            React.createElement( 'h2', null, "The winner this year is Kamal!!" )
        ),

        React.createElement( 'img', { src: "" }),

        React.createElement( 'footer', null,
            React.createElement( 'p', null, "Come back next year to view the new winner." )
        )
    )
);

function Application(props) {
    return (
        React.createElement( 'main', null,
            React.createElement( 'h1', null, "Shiva" ),

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
        React.createElement( 'html', null,
            React.createElement( 'head', null,
                React.createElement( 'meta', { charSet: "utf-8" }),
                React.createElement( 'meta', { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
                React.createElement( 'meta', { httpEquiv: "Content-Language", content: "en" }),
                React.createElement( 'meta', { name: "viewport", content: "width=device-width, initial-scale=1" }),
                React.createElement( 'title', null, "Shiva" )
            ),
            React.createElement( 'body', null,
                React.createElement( 'div', { id: "app", dangerouslySetInnerHTML: { __html: server.renderToString(app) } })
            )
        )
    );

    const body = `<!DOCTYPE html>${
        server.renderToStaticMarkup(html)
    }`;

    return body;
}

module.exports = render;
