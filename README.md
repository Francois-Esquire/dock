# Dock

Simple Starter Setup Using Node.js, Koa, React, SCSS, Rollup, Webpack and Docker.

**Features**

- Build out using future Javascript with the latest Node.js and [`esm`](https://github.com/standard-things/esm)
- [`eslint`](https://github.com/eslint/eslint), [`stylelint`](https://github.com/stylelint/stylelint), [`prettier`](https://github.com/prettier/prettier) ready out of the box
- Test concurrently using [`ava`](https://github.com/avajs/ava)
- Hot loading server & client

**Roadmap**

- [ ] HTTP/2
- [ ] TLS/SSL ready
- [ ] Containerized testing environment
- [ ] Branch-specific starters for various implementations

## Motivation

The developer experience is a major concern of mine. The main goal of this repository was to facilitate the process of bootstrapping and setup for immediate quality development.

## Get Started

- **Running The Server**

  Run `npm start` or `npm run dev` to start the hot loading server, both at localhost:3000.

- **Building The Project**

  Run `npm run build` to generate a production ready build under the dist/ directory.

- **Testing The Code**

  Run `npm test` or `npm run test-watch` to rerun tests on file change.

- **React Component Development**

  Run `npm run cosmos` to start component development at localhost:8989.

  If you are new to [`react-cosmos`](https://github.com/react-cosmos/react-cosmos), please check out the documentation and get yourself familiar with the [idea of fixtures](https://github.com/react-cosmos/react-cosmos#fixtures).

### With Docker

- **Getting Started**

  Run `docker-compose up --build`

  **Also**

  You can run the container yourself:

  ```bash
    # build it with a tag
    docker build -t dock . \

    docker container run -d -p 80:3000 --name dock --rm dock
    # keep out the -d (detached) if you want to see the logs
  ```

  :bulb: To change the node version in your container, open up the Dockerfile and change

  `FROM node:alpine # to node:10.1-alpine`

- **Deploying The Container**

  You can `npm run deploy` to start building your image and tag it.

  The command uses the `"deploy": {...}` configuration in your `package.json`, update it accordingly.

  This is useful if you have a private repository set up, as well as for getting it up on Docker Hub.

- **Ship It Out**

  Running `npm run ship` will run tests then build and finally deploy your app.

---

**Requires**

- Node >=7.6.0 - for native async/await support, primarily.

**Optional Enhancements**

- A properly setup IDE - to take advantage of ESLint, Stylelint and Prettier.
