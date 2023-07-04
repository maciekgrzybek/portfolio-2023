---
external: false
title: 'Ultimate guide to sorting in Javascript and Typescript'
description: "In this article, I'll try to explain how sorting works in the TypeScript and JavaScript world"
date: 2021-08-18
---

_This post was originally published on [Leocode Blog](https://leocode.com/development/ultimate-guide-to-sorting-in-javascript-and-typescript/)._

## Introduction

Surely in your coder/software engineer/developer/professional keyboard basher career, you came across a situation when you had to sort some kind of data or UI elements. In most cases, it's pretty straightforward, but sometimes it can be a real pain. In this article, I'll try to explain how sorting works in the TypeScript and JavaScript world, show you some real-life examples and speak briefly about few popular libraries that can make sorting much easier.

## Basic sorting

Let's start with the most basic example and sort the array of strings:

```tsx
const words = ['Tango', 'Zulu', 'Bravo', 'Lima'];
words.sort();
// -> ['Bravo', 'Lima', 'Tango', 'Zulu']
```

That's the simplest way to alphabetically sort an array of strings in ascending order. What if we want to sort it from Z to A instead? We need to pass a compare function:

```tsx
const words = ['Tango', 'Zulu', 'Bravo', 'Lima'];
words.sort((a, b) => {
  if (b > a) return 1;
  if (b < a) return -1;
  return 0;
});
// -> ['Zulu', 'Tango', 'Lima', 'Bravo']
```

This might look confusing at first (been there) but trust me, it's actually making a lot of sense when you get it.

### How the compare function works

The compare function takes two arguments - the current element and the next element. It has to return a number that will define how the elements have to be sorted. The general rule is:

- if you return a number greater than 0 - element `b` will go to the beginning (will receive a lower index number than element `a`)
- if you return a number smaller than 0 - element `a` will go to the beginning (will receive a lower index number than `b`)
- if you return 0 - elements will remain at the same position

With a simple number sorting, we can even go a step further and simplify the compare method:

```tsx
// Ascending order
const arr = [1, -6, 8, 20, 3, 3];
arr.sort((a, b) => a - b);
// -> [-6, 1, 3, 3, 8, 20]

// Descending order
const arr = [1, -6, 8, 20, 3, 3];
arr.sort((a, b) => b - a);
// -> [20, 8, 3, 3, 1, -6]
```

Let's analyze the first two array elements comparison:

- in the first example, we do `1 - (-6)` which evaluates to `7` - meaning element `b` should be before element `a` ( `-6` should be before `1`)
- in the second example, we do `-6 - 1` which evaluates to `-7` - meaning element `a` should be before element `b` ( `1` should be before `-6`)

Then the `sort` method continues that for other numbers. How exactly? That depends on the browser. As it turns out different browsers are using different algorithms to do that. The API and the output are the same, but under the hood, they are sorting things in a slightly different manner. If you want proof, try the code below in Firefox and Chrome consoles, and look at what's being returned - it's not the same.

```tsx
const words = ['Tango', 'Zulu', 'Bravo', 'Lima'];
words.sort((a, b) => {
  console.log(`Comparing ${a} to ${b}`);
  if (b > a) return 1;
  if (b < a) return -1;
  return 0;
});
```

If you want to dig even deeper - check out this [great explanation of different sorting algorithms](https://khan4019.github.io/front-end-Interview-Questions/sort.html).

#### TIP

Worth having in mind: `sort` is a mutable method, which means it mutates the original array. If you want to create a new array, you can spread it and then sort it like this:

```tsx
const words = ['Tango', 'Zulu', 'Bravo', 'Lima'];
[...word].sort();
```

## Sorting with `localeCompare` method

In previous examples, we simply compared the strings and return the correct value to sort the strings in the array. But there's another, awesome way to do that, plus it gives us additional superpowers! I'm talking about the `localeCompare` method. What is it, you ask? Similar to examples before, the function will return a number as a result of comparing the strings, but it allows us to take the locale into consideration. This is especially useful with languages that have special characters, as they might have a different position in the alphabet. Let's see some examples, so it can all make more sense.

```tsx
const words = ['Tango', 'Zulu', 'Bravo', 'Lima'];
words.sort((a, b) => a.localeCompare(b, 'en'));
// -> ['Bravo', 'Lima', 'Tango', 'Zulu']
```

Like I've mentioned before the `localeCompare` return a numeric value, so if `a` is before `b` in the alphabet, it yields a negative value. If `b` is before `a` - it yields a positive value. If they are the same - it yields `0`. And we already know what does that mean for the `sort` method from the `How the compare function works` section.

But where are the superpowers, you ask? Let's take a look.

### Locale

If you are dealing with multiple languages in your app/website, it's important to pass the locale of the current language when you use sorting, as some characters have a different position in the alphabet.

```tsx
'ö'.localeCompare('z', 'de');
// returns a negative value: in German, ö sorts before z

'ö'.localeCompare('z', 'sv');
// returns a positive value: in Swedish, ö sorts after z
```

### Options

`localeCompare` has also a third argument, which is options. There are a few of them, but I'll show you two, in my opinion, most needed on a daily basis. If you want to read more about them all, I highly recommend the [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) and [Tech on the net](https://www.techonthenet.com/js/string_localecompare.php).

#### Casing

You can pass a `caseFirst` property to the options. If you set it up as `upper` it will sort the uppercase words first (when they are starting with the same letter). If you pass `lower` - it will sort the lowercase ones first.

```tsx
const words = ['Tango', 'tango', 'Bravo', 'lima', 'Lima'];

words.sort((a, b) => a.localeCompare(b, 'en', { caseFirst: 'upper' }));
// -> [ 'Bravo', 'Lima', 'lima', 'Tango', 'tango' ]

words.sort((a, b) => a.localeCompare(b, 'en', { caseFirst: 'lower' }));
// -> [ 'Bravo', 'lima', 'Lima', 'tango', 'Tango' ]
```

#### Numeric values

Let's say we want to sort the numeric strings - if we won't pass the `numeric: true` property, they will be treated as strings and sorted like them - `"101"` will go before `"2"` because 1 is smaller than 2. Check the examples below for a better understanding.

```jsx
const words = ['4', '1001', '30', '200'];

words.sort((a, b) => a.localeCompare(b, 'en'));
// -> [ '1001', '200', '30', '4' ]

words.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
// -> [ '4', '30', '200', '1001' ]
```

## Real-life examples

We've covered the theory (which I hope will give you a better understanding of how sorting works), now let's focus on real-life examples. I want to show you a few that will use just the native `sort` method and also a few that will use external libraries like `[lodash](https://lodash.com/)`. Let's go!

### Sorting an array of objects

Let's say we have an array of objects (each object will represent one dog) and we want to alphabetically sort these objects by the `breed` property. Let's see how we can do that.

```tsx
// Define the interface for our objects
interface Dog {
  breed: string;
  name: string;
}

const dogs: Dog[] = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
];

// Sort based on `breed` property.
// We don't have to explicitly type `a` and `b` arguments - Typescipt will infer them from the `dogs` array
dogs.sort((a, b) => {
  if (b.breed < a.breed) return 1;
  if (b.breed > a.breed) return -1;
  return 0;
});

// ->
// [
//   {breed: 'Bulldog', name: 'Thanos'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
// ]
```

As you can see, this is very similar to regular string sorting, the only difference is that we are comparing specific properties of the objects.

#### TIP

It all depends on your preferences (and probably your team standards) but you can make the sorting function even shorter:

```tsx
dogs.sort((a, b) => (b.breed < a.breed ? 1 : b.breed > a.breed ? -1 : 0));
```

### Sorting based on different values

So we covered that, but what if we'll have two bulldogs on our list? We can sort them by `breed` first and then by `name`.

```tsx
const dogs = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
  { breed: 'Bulldog', name: 'Atreus' },
];

// Fist sort based on `breed` then if they are the same, sort by `name` property
dogs.sort((a, b) => {
  if (b.breed < a.breed) return 1;
  if (b.breed > a.breed) return -1;
  else {
    if (b.name < a.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
  }
});

// ->
// [
//   {breed: 'Bulldog', name: 'Atreus'},
//   {breed: 'Bulldog', name: 'Thanos'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
// ]
```

As you can see we just add another "branch" in here - if the compared values are the same, we add another `else` path that handles comparing another property on the object - `name` in this case.

#### TIP

Sometimes your sorting functions might get fairly complicated so it makes sense to extract them to their own methods and pass them to `sort`.

```tsx
// Define the interface for our objects
interface Dog {
  breed: string;
  name: string;
}

// It's a good idea to pass the types to arguments, otherwise TS will treat them as type of `any`
const sortDogsByBreedAndName = (a: Dog, b: Dog) => {
  if (b.breed < a.breed) return 1;
  if (b.breed > a.breed) return -1;
  else {
    if (b.name < a.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
  }
};

dogs.sort(sortDogsByBreedAndName);
```

### Sorting based on another array

Getting back to our beloved dogs, imagine we want to sort them by `breed` but not alphabetically. Let's say we have a specific list of breeds that needs to be used as a reference for the sorting logic. Take a look below as it might be easier to understand with the code example:

```tsx
// This array shows the order of sorting the dogs - Spaniel should be first
// and German Shepard should be last
const breedsOrder = ['Spaniel', 'Pug', 'Bulldog', 'Poodle', 'German Shepard'];
const dogs = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
  { breed: 'Pug', name: 'Bean' },
  { breed: 'Poodle', name: 'Axel' },
];

dogs.sort(
  (a, b) => breedsOrder.indexOf(a.breed) - breedsOrder.indexOf(b.breed)
);

// ->
// [
//   { breed: 'Spaniel', name: 'Marley' },
//   { breed: 'Pug', name: 'Bean' },
//   { breed: 'Bulldog', name: 'Thanos' },
//   { breed: 'Poodle', name: 'Axel' },
//   { breed: 'German Shepard', name: 'Rex' }
// ]
```

What happened here? The `array.indexOf` method returns a number - position of the passed argument in the array. In this situation, if we compare the index of `'German Shepard' (4)` and `'Spaniel' (0)` we will receive `-4` which means that `'Spaniel'` should go first in our sorting method.

## External libraries

Apart from your vanilla JS/TS solutions, there are lots of external libraries that expose a nice API to makes sorting easier. Below I will show you examples from two of them - `[lodash](https://lodash.com/)` and `[fast-sort](https://github.com/snovakovic/fast-sort)`

### [lodash](https://lodash.com/)

[Lodash](https://lodash.com/) is a very popular JavaScript utility library. It has all kind of various methods that helps a lot with you daily developer tasks. It also lets you use few sorting helper functions.

#### sortBy

This method allows you to sort arrays of objects. The output is exactly the same as in the `Sorting based on the different values` section before. As a first argument, you pass the array to sort and the second one is an array of object properties that we want to sort by (in the example below - sort first by breed, then by name if breeds are the same).

```jsx
import { sortBy } from 'lodash';

const dogs = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
  { breed: 'Bulldog', name: 'Atreus' },
];

sortBy(dogs, ['breed', 'name']);
// ->
// [
//   {breed: 'Bulldog', name: 'Atreus'}
//   {breed: 'Bulldog', name: 'Thanos'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
// ]
```

#### orderBy

This method is almost identical to `sortBy` except that it allows specifying the sort orders of the iterates. So if we want to sort by breed in ascending manner, but then by name in descending one, we can do something like this:

```jsx
import { orderBy } from 'lodash';

const dogs = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
  { breed: 'Bulldog', name: 'Atreus' },
];

orderBy(dogs, ['breed', 'name'], ['asc', 'desc']);
// ->
// [
//   {breed: 'Bulldog', name: 'Thanos'}
//   {breed: 'Bulldog', name: 'Atreus'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
// ]
```

### fast-sort

This is and easy to use and flexible sorting library with TypeScript support. It has a little bit different approach than lodash when it comes to the API. Let's see how we can solve the same sorting problem as we had before:

```jsx
const dogs = [
  { breed: 'German Shepard', name: 'Rex' },
  { breed: 'Spaniel', name: 'Marley' },
  { breed: 'Bulldog', name: 'Thanos' },
  { breed: 'Bulldog', name: 'Atreus' },
];

// Sort ascending by breed then by name
sort(dogs).asc([(dog) => dog.breed, (dog) => dog.name]);
// ->
// [
//   {breed: 'Bulldog', name: 'Atreus'}
//   {breed: 'Bulldog', name: 'Thanos'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
// ]

// Sort ascending by breed then descending by name
sort(dogs).by([{ asc: (dog) => dog.breed }, { desc: (dog) => dog.name }]);

// ->
// [
//   {breed: 'Bulldog', name: 'Thanos'}
//   {breed: 'Bulldog', name: 'Atreus'},
//   {breed: 'German Shepard', name: 'Rex'},
//   {breed: 'Spaniel', name: 'Marley'}
//
```

Both of the mentioned libraries have of course much more options and possibilities. Also there are plenty of other libraries that solve the same or similar problems, just to name a few - `match-sorter`, `sort-array` or `relevancy`. I encourage you to check their documentation and have a play - trust me, sometimes they can be a live-saver.

## Summary

I hope this article will give you more confidence when it comes to sorting in Javascript and Typescript. We went from basics, through more complicated examples and finished on external libraries that can take some of the work from our shoulders. I think you are now ready to... sort it out... (dad joke-level pun intended).
