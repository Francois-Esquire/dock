# Koa Forge

### Simple Starter Setup

**Features**

* [x] Hot reload for server & client using Koa, React, CSS, SCSS (modules).
* [x] Component development experience enhanced by react-cosmos.
* [x] Simple testing set up using Ava and ready for articulation.
* [x] Preconfigured ESlint, Stylelint, Prettier ready out of the box.
* [x] Deployment artifact /dist ready on install (**don't forget to "npm install" beforehand**).
* [x] Containerized via Docker, with brief lifecycle method on command (**make sure you have Docker installed**).

### Quick Start

To run the server:

```bash
  npm start

  # or:

  # npm run dev

  # to run the hot server.
```

---

To build for deployment:

```bash
  npm run build
```

To run cosmos for component development:

```bash
  npm run cosmos
```

To run tests:

```bash
  npm test

  # or:

  # npm test:watch

  # to watch for file change.
```

---

To run the Docker container:

Step 1: start with building the image:

```bash
  npm run container:build
```

Step 2: then you can start it with:

```bash
  npm run container:run
```

**alternatively, you can just run 'npm run container' to do both of the steps listed above**

Step 3: to stop the container:

```bash
  npm run container:stop
```

---

### Requires

* Node >=7.6.0 - for async/await support.
* Docker - to run as container.
* A proper IDE setup - to take advantage of ESLint, Stylelint and Prettier.
