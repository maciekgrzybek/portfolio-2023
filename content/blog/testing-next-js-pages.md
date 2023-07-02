---
external: false
title: 'Testing Next.js pages - Little Bits'
description: 'Testing Next.js pages - Little Bits'
date: 2021-05-26
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

In this episode, I want to show you how you can animate elements in your Svelte app on scroll.

## Why?

[Next.js](https://nextjs.org/) is a super cool React framework, that gives you an amazing developer experience. In this episode, I'll show you how to test the Next pages with few useful libraries. This setup will allow us to create integration tests with mocking calls to the API. You can check the working example [here.](https://github.com/maciekgrzybek/test-next-app)

## Setup

First of all, set up your Next app with Typescript and React Testing Library. I explained how to do it in one of the [previous episodes](https://maciekgrzybek.dev/blog/setup-next-js-with-typescript-jest-and-react-testing-library-little-bits/).

When it's done, install rest of the needed dependencies:

- [MSW](https://mswjs.io/) - API mocking tool
- [Next Page Tester](https://github.com/toomuchdesign/next-page-tester) - DOM integration testing tool for Next.js
- [Axios](https://github.com/axios/axios) - you can use any fetching library, but we will go with this one

```powershell
npm i msw next-page-tester -D
npm i axios
```

## App

Create a simple homepage in `pages/index.tsx`. It will make a server-side call to the [Stars Wars API](https://swapi.dev/) to get the list of films and print them out.

```tsx
import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';

export interface Film {
  title: string;
  director: string;
  release_date: string;
}

export interface FilmsResponse {
  results: Film[];
}

export default function Home({
  data,
  notFound,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (notFound) {
    return <div>Something went wrong, please try again</div>;
  }

  return (
    <div>
      <main>
        <ul>
          {data.results.map(({ title, release_date, director }) => (
            <li key={title}>
              <h2>{title}</h2>
              <span>Release date: {release_date}</span>
              <span>Director: {director}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  data?: FilmsResponse;
  notFound?: boolean;
}> = async () => {
  try {
    const { data } = await axios.get<FilmsResponse>(
      'https://swapi.dev/api/films/'
    );
    if (!data.results) {
      return {
        props: { notFound: true },
      };
    }

    return {
      props: { data },
    };
  } catch (error) {
    return {
      props: { notFound: true },
    };
  }
};
```

## Preparing mocks

In the test environment, we don't really want to hit the actual API so we will mock it with `msw`.

First of all, let's create a list of mocked films in `__mocks__/mocks.ts`

```tsx
import { FilmsResponse } from '../pages';

export const mockedFilms: FilmsResponse = {
  results: [
    {
      title: 'A New Hope',
      release_date: '1977-05-25',
      director: 'George Lucas',
    },
    {
      title: 'The Empire Strikes Back',
      release_date: '1980-05-17',
      director: 'Richard Marquand',
    },
  ],
};
```

Next, let's create server handlers (we define what `msw` should return when our app hit a specific URL). Let's create a new file `test-utils/server-handlers.ts`

```tsx
import { rest } from 'msw';

import { API_URL } from '../config'; //'https://swapi.dev/api/films'
import { mockedFilms } from '../__mocks__/mocks';

const handlers = [
  rest.get(API_URL, (_req, res, ctx) => {
    return res(ctx.json(mockedFilms));
  }),
];

export { handlers };
```

Short explanation:

- `rest.get(API_URL` - when app send a GET request to the `[https://swapi.dev/api/films](https://swapi.dev/api/films)` endpoint
- `return res(ctx.json(mockedFilms))` - return the list of mocked films

Now, let's create a mock server that will run for our tests. Create a new file in `test-utils` folder names `server.ts`

```tsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './server-handlers';

const server = setupServer(...handlers);
export { server, rest };
```

Then, in `jest.setup.ts` file, add the code that will be responsible for running the server:

```tsx
import { server } from './test-utils/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

If you want to learn more about `msw` tool check out their [documentation](https://mswjs.io/docs/), it's really good. Also, as usual, I recommend reading one of the [Kent Dodds's blog post about mocking](https://kentcdodds.com/blog/stop-mocking-fetch). It explains the topic really well.

## Writing tests

Now, this is a really simple app, but I just want to show an example of how we can nicely test its behaviour. In this scenario, we only want to see if the films are printed on the screen and if it shows an error message when API returns something else than data. For that, we will use `jest`, `react-testing-library` and `next-page-tester`.

```tsx
import { screen, waitFor } from '@testing-library/react';
import { getPage } from 'next-page-tester';

import { mockedFilms } from '../__mocks__/mocks';
import { server, rest } from '../test-utils/server';
import { API_URL } from '../config';

test('displays the list of films', async () => {
  const { render } = await getPage({ route: '/' });

  render();

  await waitFor(() => {
    mockedFilms.results.forEach(({ title, release_date, director }) => {
      expect(
        screen.getByRole('heading', { level: 2, name: title })
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Release date: ${release_date}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`Director: ${director}`)).toBeInTheDocument();
    });
  });
});

test('shows the error message when receive an error from the API', async () => {
  server.use(rest.get(API_URL, async (_req, res, ctx) => res(ctx.status(404))));

  const { render } = await getPage({ route: '/' });

  render();

  await waitFor(() => {
    expect(
      screen.getByText('Something went wrong, please try again')
    ).toBeInTheDocument();
  });
});
```

As you can see, mocking the Next pages is really simple with `next-page-tester` tool. You can just simply pass the path as an argument, and it will render the whole page that's ready for testing. Check out the projects [GitHub page](https://github.com/toomuchdesign/next-page-tester) for more details.

Also, notice how we overwrite the API server handler (instead of an actual data, we want to return a 404 status code when the app hits the API):

```jsx
server.use(rest.get(API_URL, async (_req, res, ctx) => res(ctx.status(404))));
```

## Summary

As you can see, testing Next pages can be super fun and easy. These integrations tests are great for testing a general user journey, and are perfect addition to regular unit tests, where we can test more detailed scenarios.
