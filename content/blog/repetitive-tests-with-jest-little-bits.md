---
external: false
draft: true
title: Repetitive tests with jest - Little Bits
description: How you can run repetitive test cases with Jest. This is specifically useful when testing helpers and utility methods.
date: 2020-08-21
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

In this short article, I want to show you how you can run repetitive test cases with Jest. This is specifically useful when testing helpers and utility methods.

#### Useful links:

- [Jest](https://jestjs.io/docs/en/api#1-testeachtablename-fn-timeout)

## The problem

Let's say we have a simple method for some kind of string manipulation. The function takes an original string and adds another one to it. We can also define if we want the new string to be added at the end or the beginning, as well as change it to be uppercased.

```javascript
const addToString = (word, addition, placement, upperCase) => {
  let stringToReturn;

  if (placement === 'end') {
    stringToReturn = `${word}${addition}`;
  } else {
    stringToReturn = `${addition}${word}`;
  }

  return upperCase ? stringToReturn.toUpperCase() : stringToReturn;
};
```

To test it we could so something like that:

```javascript
test('changes string node to node_js', () => {
	expect(addToString('node', 'js_')).toBe('js_node');
});

test('changes string node to _jsnode', () => {
	expect(addToString('node', '_js', 'end')).toBe('node_js');
});

...
```

And so on with other possible scenarios.

## How to solve it

Instead, we can use amazing jest method `test.each`:

```javascript
test.each`
  originalWord | addition | placement    | uppercase    | expected
  ${'node'}    | ${'js_'} | ${undefined} | ${undefined} | ${'js_node'}
  ${'node'}    | ${'js_'} | ${'end'}     | ${undefined} | ${'nodejs_'}
  ${'node'}    | ${'js_'} | ${null}      | ${true}      | ${'JS_NODE'}
  ${'node'}    | ${'js_'} | ${'end'}     | ${true}      | ${'NODEJS_'}
`(
  'changes string $originalWord to $expected - uppercase -> $uppercase',
  ({ originalWord, addition, placement, uppercase, expected }) => {
    expect(addToString(originalWord, addition, placement, uppercase)).toBe(expected);
  }
);
....
```

## Summary

As you can imagine, this works really well with bigger methods that have lots of different permutations as you can pass tens of different test scenarios while handling only one assertion. I hope that this article will help you with writing amazing tests.
