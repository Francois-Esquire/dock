# Koa Dock

Simple Starter Setup

**Features**

* [x] Build out using future Javascript with the latest Node.js and esm module
* [x] ESlint, Stylelint, Prettier ready out of the box
* [x] Hot loading server & client
* [x] Test concurrently using Ava
* [x] Docker primed

**Roadmap**

* [ ] HTTP/2
* [ ] TLS/SSL ready
* [ ] Isolated testing environment

Uses Koa, React, SCSS(modules), Rollup and Webpack.

---

## Quick Start

To run the server:

```bash
  npm start

  # or:

  npm run dev

  # to run the hot loading.
```

### Local Development

To build for production:

```bash
  npm run build
```

To run tests locally:

```bash
  npm test

  # or:

  npm run test-watch

  # to watch for file change.
```

To run cosmos for component development:

```bash
  npm run cosmos
```

### With Docker

To get started, run:

```bash
  # in repo or reference the docker-compose.yml with -c
  docker-compose up --build
```

or, you can run the container yourself.

```bash
  # build it with a tag
  docker build -t koa-dock . \

  docker container run -d -p 80:3000 --name dock --rm koa-dock
  # keep out the -d (detached) if you want to see the logs
```

To change the node version in your container, open up the Dockerfile and change the default tag

```bash
  FROM node:alpine # to node:10.1-alpine
```

#### Deploying your Container

You can run:

```bash
  npm run deploy
```

### Ship it out

```bash
  npm run ship
```

this will run tests then build and finally deploy your app.

---

### Requires

* Node >=7.6.0 - for native async/await support primarily.

#### Optional Enhancements

* A properly setup IDE - to take advantage of ESLint, Stylelint and Prettier.
