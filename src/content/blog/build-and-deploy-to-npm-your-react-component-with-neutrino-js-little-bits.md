---
external: false
title: 'Build and deploy your React component to NPM with Neutrino.js - Little Bits'
description: 'How you can easily set up your dev environment for building React component and then how you can deploy it to NPM so other developers can start using it.'
date: 2019-09-06
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

In this short article, I want to show you how you can easily set up your dev environment for building React component and then how you can deploy it to NPM so other developers can start using it.

#### Useful links:

- [Neutrino JS](https://neutrinojs.org)
- [NPM publishing docs](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

#### Plan

1. Create a project - yarn or npx
2. Build a component or use the default one
3. Run build
4. Prepare package.json file
5. Deploy to NPM

### 1. Create a project - yarn or npx

```
yarn create @neutrinojs/project my-not-really-exciting-component
```

or

```
npx @neutrinojs/create-project my-not-really-exciting-component
```

After that Neutrino will ask you about your project. Select `Components` -> `React components`. In the next step choose the testing library (I usually go for Jest) and linting style (Airbnb or StandardJS). Neutrino will install all the dependencies and set up the boilerplate.

### 2. Build a component or use the default one

Neutrino supplies us with a simple HelloWorld component. We will use it in this step, but obviously, in a real-world scenario, build something awesome.
TIP: Add readme.md file with directions for installing, configuring, and using your code.
To run the dev environment run:

```
yarn start
```

or

```
npm start
```

That will open `localhost:5000` with your project.

### 3. Run build

If you're happy with your component run:

```
yarn run build
```

or

```
npm run build
```

Your project is optimized and ready for production.

### 4. Prepare package.json file

Before deploying our super component, we need to add some details to package.json. Here's a sample, minimal configuration:

```json
{
  "name": "my-not-really-exciting-component",
  "version": "1.0.0",
  "description": "My component, not really exicitng.",
  "main": "build/HelloWorld.js",
  "author": "Your Name <your_email@gmail.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourprofile/my-not-really-exciting-component"
  },
  "keywords": ["react", "javascript", "component"],
  "license": "MIT",
  "scripts": {
    "build": "neutrino build",
    "start": "neutrino start",
    "lint": "neutrino lint",
    "test": "neutrino test"
  },
  "devDependencies": {
    "@neutrinojs/airbnb": "^8.3.0",
    "@neutrinojs/jest": "^8.3.0",
    "@neutrinojs/react-components": "^8.3.0",
    "neutrino": "^8.3.0",
    "prop-types": "^15.7.2",
    "react": "^16.9.0",
    "react-dom": "^16.9.0"
  }
}
```

### 5. Deploy to NPM

Create an account on [npm](https://www.npmjs.com/). After that, from your terminal simply run:

```
npm publish
```

### Summary

That's it, you've managed to successfully deploy your react component to the NPM registry. Now anyone else can start using it in their projects and you just need to prepare for all the dev fame coming your way 😎.
