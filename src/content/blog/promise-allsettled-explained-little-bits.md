---
external: false
title: 'Promise.allSettled explained - Little Bits'
description: 'In this episode, I want to show you a really powerful tool for working with Promises - `allSetled` method.'
date: 2021-08-09
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

In this episode, I want to show you a really powerful tool for working with Promises - `allSetled` method.

# Problem

Imagine that you have two fetch methods, that are getting some data from external APIs. When both of them returns that data, you combine it and pass it down to your client. Methods are parallel and you use `Promise.all` method. When one of them fails, you fail the whole service and return an error - a pretty common scenario. Let's see how that might look like:

```tsx
const fetchMeSomeData = fetch('/url');
const fetchMeSomeOtherData = fetch('/other-url');

const [data, otherData] = await Promise.all([
  fetchMeSomeData,
  fetchMeSomeOtherData,
]);

return mapTheResponse(data, otherData);
// Manipulate the `data` and `otherData` and return to the client
```

Now imagine your PM comes to you and say "That's all good, but we want to change the behaviour. If the `otherData` call will fail, we want to map the response only based on `data` - we can ignore the `otherData`". How we can achieve this?

# Solution

We can use the `Promise.allSettled` method, which gives us better control over the flow.

```tsx
const fetchMeSomeData = fetch('/url');
const fetchMeSomeOtherData = fetch('/other-url');

const [data, otherData] = await Promise.allSettled([
  fetchMeSomeData,
  fetchMeSomeOtherData,
]);

if (otherData.status === 'rejected')
  return mapTheResponseWithoutOtherData(data.value);
if (data.status === 'rejected') throw new Error('Not enough data');

return mapTheResponse(data.value, otherData.value);
```

As you can see, this gives us more options when it comes to controlling the behaviour of our fetch methods. We can ignore the failed `fetchMeSomeOtherData` method and focus only on the response from `fetchMeSomeData`.

# Summary

This handy method was release in the ES2020 edition, so it's relatively new to the JS/TS ecosystem, but as you can see, it's very powerful and allows us to have much more control over our code flow. If you want to learn more about it, check out the [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).
