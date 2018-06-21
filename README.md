# Dock

Simple Starter Setup

**Features**

- Build out using future Javascript with the latest Node.js and esm module
- ESlint, Stylelint, Prettier ready out of the box
- Hot loading server & client
- Test concurrently using Ava
- Docker primed

**Roadmap**

- [ ] HTTP/2
- [ ] TLS/SSL ready
- [ ] Containerized testing environment

Uses Koa, React, SCSS(modules), Rollup and Webpack.

## Quick Start

- **Running The Server**

  Run `npm start` or `npm run dev` to start the hot loading server, both at localhost:3000.

- **Building The Project**

  Run `npm run build` to generate a production ready build under the dist/ directory.

- **Testing The Code**

  Run `npm test` or `npm run test-watch` to rerun tests on file change.

- **React Component Development**

  Run `npm run cosmos` to start component development at localhost:8989.

  If you are new to `react-cosmos`, please check out the documentation and get yourself familiar with the idea of fixtures.

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

  :bulb: To change the node version in your container, open up the Dockerfile and change `FROM node:alpine # to node:10.1-alpine`, the default tag

- **Deploying The Container**

  You can `npm run deploy` to start building your image and tag it.

  This uses the `"deploy": {...}` configuration in your `package.json`, update it accordingly.

- **Ship It Out**

  Running `npm run ship` will run tests then build and finally deploy your app.

---

**Requires**

- Node >=7.6.0 - for native async/await support, primarily.

**Optional Enhancements**

- A properly setup IDE - to take advantage of ESLint, Stylelint and Prettier.
