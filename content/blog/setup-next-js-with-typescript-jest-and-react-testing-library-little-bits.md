---
external: false
title: 'Setup Next.js with Typescript , Jest and React Testing Library - Little Bits'
description: "Next is a super cool React framework, that gives you an amazing developer experience. In this episode, I'll show you how to set it up with Typescript, Jest and React Testing Library."
date: 2020-08-21
---

## Why?

[Next.js](https://nextjs.org/) is a super cool React framework, that gives you an amazing developer experience. In this episode, I'll show you how to set it up with Typescript, Jest and React Testing Library.

## Setup

To set up the project we'll need to follow these steps:

- to create Next app, from your terminal run

```shell
npx create-next-app
```

- install typescript as well as react and node types

```shell
npm install typescript @types/react @types/node -D
```

- install jest, react testing library, babel-jest, @testing-library/jest-dom and types for jest

```shell
npm i jest @testing-library/react @types/jest babel-jest @testing-library/jest-dom @testing-library/user-event @testing-library/dom -D
```

- create config files for typescript and babel

```shell
touch tsconfig.json
touch .babelrc
```

- add to the babel config file

```json
{
  "presets": ["next/babel"]
}
```

- create `jest.config.js` and `jest.setup.ts` files

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};
```

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
```

- start the app so next can configure typescript

```shell
npm run dev
```

#### BONUS

If you're going to use CSS modules, make sure you also include these steps:

- install [`identity-obj-proxy` package](https://www.npmjs.com/package/identity-obj-proxy)

```shell
npm i identity-obj-proxy -D
```

- update `jest.config.js` file to look like this

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
};
```

Now we are good to go, you can start changing your component from `.js` to `.tsx` and building your awesome app.
