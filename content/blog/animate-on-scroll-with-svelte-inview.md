---
external: false
title: 'Animate on scroll with Svelte Inview - Little Bits'
description: 'In this episode, I want to show you how you can animate elements in your Svelte app on scroll. '
date: 2022-03-05
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

In this episode, I want to show you how you can animate elements in your Svelte app on scroll.

## Problem

When user is scrolling your Svelte app/website, we want to animate the entering elements to get that extra fancy feel.

![Gif showing the scroll animation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b29o21502ru20oapsoca.gif)

The best solution is to use Intersection Observer, but we can also use a nice abstraction built on top of it - [`svelte-inview`](https://github.com/maciekgrzybek/svelte-inview). This is a small library I created some time ago that greatly simplify usage of the IO API. Let's see how we can do this.

## Solution

### Create an app with Vite

Let's use [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) to create a simple Svelte App:

```shell
npm create vite@latest my-svelte-app -- --template svelte

cd my-svelte-app

npm i

npm run dev
```

### Add scaffolding

Let's add some simple app with basic styling. Paste that code in your `App.svelte` file:

```html
<script>
  import AnimatedElement from './lib/AnimatedElement.svelte';
</script>

<main>
  <div class="hero">
    <h1>Hello Svelte Inview</h1>
    <p>Scroll down to animate the elements</p>
  </div>
  <div class="full-height">
    <AnimatedElement />
  </div>
  <div class="full-height">
    <AnimatedElement />
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 0 1em;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 0;
  }

  .hero {
    height: calc(100vh - 16px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .full-height {
    height: 100vh;
    display: flex;
    justify-content: center;
  }
</style>
```

You probably notice that we import the `AnimatedElement` component - we will create it in the next step.

### Add `AnimatedElement` component

Create a file called `AnimatedElement.svelte` and add this code:

```html
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { inview } from 'svelte-inview';

  let isInView;
</script>

<div
  class="wrapper"
  use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
  on:change={({ detail }) => {
    isInView = detail.inView;
  }}
>
  {#if isInView}
    <div in:fade class="box">
      <h3>Appears from nowhere</h3>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error,
        adipisci nihil iste.
      </p>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    margin-top: 30px;
  }

  .box {
    width: 300px;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    border-radius: 10px;
  }
</style>
```

What is going on here?
First we import the `inview` action and animation from svelte.

Then we assign the action to the wrapper with some options:

- `unobserveOnEnter: true` - this means that once element is on the screen and animated, it won't be animated again
- `rootMargin: '-20%' - this means that element will be considered "on screen" once it'll reach 20% of the monitor - better explanation [here](https://github.com/maciekgrzybek/svelte-inview#usage-with-rootmargin)

Next step is to handle the element entry - we assign the `inView` flag from the action to our local variable - `isInView`. This allows us to determine if element should be animated.

Then we check if `isInView` is true, if it is we animate the element into view by adding the `in:fade` action.

## Useful links

- [`svelte-inview`](https://github.com/maciekgrzybek/svelte-inview) action
- [explanation of Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - which is used by `svelte-inview` internally
- more about [svelte actions](https://svelte.dev/docs#template-syntax-element-directives-use-action)
- more about [in/out animations in svelte ](https://svelte.dev/docs#template-syntax-element-directives-in-fn-out-fn)
