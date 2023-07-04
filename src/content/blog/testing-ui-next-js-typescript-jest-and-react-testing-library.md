---
external: false
title: 'Testing UI - Next JS, Typescript, Jest and React Testing Library'
description: 'Learn how to write great tests for your React application'
date: 2020-11-10
---

## Intro

As you know, React is just JavaScript. That means it can be tested just like any other JS application. There are lots of testing libraries and test runners out there, but I find that the best setup is [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). I use it on a daily basis at work and on my side projects. Worth mentioning that this is also a [stack recommended by the React Team itself](https://reactjs.org/docs/testing.html).

The thing I love about RTL is the fact that it's focused on testing **how your application behaves**, **not how it's implemented.** That gives you higher confidence that the user won't be surprised by some weird bugs etc. If you want to learn more about this approach, I strongly recommend these two articles by Kent C. Dodds

- [Testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) is about why _testing implementation details is a recipe for disaster_,
- [Avoid the test user](https://kentcdodds.com/blog/avoid-the-test-user) is talking about who do you really need to test for.

Now let's see how we can use all that knowledge in a working example.

## What we are going to test?

For the purpose of this tutorial, I've created a simple shopping cart with [NextJS](https://nextjs.org/). You can see the live demo [here](https://react-ts-testing-tutorial.vercel.app/) or if you want to see the code behind it check [the repo](https://github.com/maciekgrzybek/react-ts-testing-tutorial).

Functionally, the cart is pretty standard, the user will be able to **change the number of items, place an order, remove items from the cart or add a promo code**. We're not going to be worried about adding new items to the cart, closing cart etc as we want to focus strictly on the cart behaviour.

![Components that builds the application](/images/components.jpg)

Let's treat our cart as a **widget** with some nested components inside. When thinking about **what we want to test**, I usually go from the most nested component, up to the _root_ and write down all the things that can happen while using the product.

Not all the components have to have their own _spec_ file. For example, `Promo` and `Prices` components are purely presentational, they just render whatever props are passed to them. In that case, we don't have to write specific tests.

For this tutorial, we will create two _spec_ files, [`Product.spec.tsx`](https://github.com/maciekgrzybek/react-ts-testing-tutorial/blob/master/components/cart/product/Product.spec.tsx) and [`Cart.spec.tsx`](https://github.com/maciekgrzybek/react-ts-testing-tutorial/blob/master/components/cart/Cart.spec.tsx). That should cover all our scenarios.

Having our user's experience in mind let's write test cases (empty for now, we will add the body later).

```tsx
//Product.spec.tsx
test('shows the correct name', () => {});
test('shows the correct color', () => {});
test('shows the correct price', () => {});
test('shows the correct quantity', () => {});
test('shows the discounted price', () => {});
test('does not show the discounted price', () => {});
test('disables the decrease button when the quantity equals 1', () => {});
```

```tsx
//Cart.spec.tsx
test('shows the correct products', () => {});
test('shows the correct order price', () => {});
test('shows the correct delivery price', () => {});
test('shows the correct total price', () => {});
test('allows to apply a valid promo code', () => {});
test('allows to insert new promo code', () => {});
test('does not allow to apply invalid promo code', () => {});
test('updates the prices accordingly when valid promo code is applied', () => {});
```

We could probably come up with even more test cases but these here are covering the main functionalities of our app.

## Writing code

### Product component

Let's start with the `Product` component. First of all, we'll create a default props object that will be passed to the rendered component. For the data source in our project, we are using a [mock file](https://github.com/maciekgrzybek/react-ts-testing-tutorial/blob/master/mock-data.ts). We can use the same data in our tests.

```tsx
//Product.spec.tsx
import React from 'react';
import { render } from '@testing-library/react';
import Product, { Props } from './Product';
import { mockData } from '../../../mock-data';

const DEFAULT_PROPS: Props = {
  product: mockData.products[0],
  handleRemove: jest.fn(),
  handleAdd: jest.fn(),
  handleSubtract: jest.fn(),
};
```

### Most basic tests

Now, let's tackle the first four tests together, as they are very similar - they just check if the passed props are currently rendered on the screen.

```tsx
//Product.spec.tsx
test('shows the correct name', () => {
  render(<Product {...DEFAULT_PROPS} />);
  expect(screen.getByText(DEFAULT_PROPS.product.name)).toBeInTheDocument();
});

test('shows the correct color', () => {
  render(<Product {...DEFAULT_PROPS} />);
  expect(screen.getByText(DEFAULT_PROPS.product.color)).toBeInTheDocument();
});

test('shows the correct price', () => {
  render(<Product {...DEFAULT_PROPS} />);
  expect(
    screen.getByText(DEFAULT_PROPS.product.price.toString(), { exact: false })
  ).toBeInTheDocument();
});

test('shows the correct quantity', () => {
  render(<Product {...DEFAULT_PROPS} />);
  expect(
    screen.getByText(DEFAULT_PROPS.product.quantity.toString())
  ).toBeInTheDocument();
});
```

As you can see, we pass the `Product` component with `DEFAULT_PROPS` to the `rtl's` `render` method. As you probably guessed, this method will render our component (check the [docs](https://testing-library.com/docs/react-testing-library/api#render) for more info).
For better re-usability we can extract the render method like this:

```tsx
//Product.spec.tsx
const renderComponent = (props = {}) => {
  return {
    ...render(<Product {...DEFAULT_PROPS} {...props} />),
    props: {
      ...DEFAULT_PROPS,
      ...props,
    },
  };
};

test('shows the correct name', () => {
  renderComponent();
  expect(screen.getByText(DEFAULT_PROPS.product.name)).toBeInTheDocument();
});

test('shows the correct color', () => {
  renderComponent();
  expect(screen.getByText(DEFAULT_PROPS.product.color)).toBeInTheDocument();
});

test('shows the correct price', () => {
  renderComponent();
  expect(
    screen.getByText(DEFAULT_PROPS.product.price.toString(), { exact: false })
  ).toBeInTheDocument();
});

test('shows the correct quantity', () => {
  renderComponent();
  expect(
    screen.getByText(DEFAULT_PROPS.product.quantity.toString())
  ).toBeInTheDocument();
});
```

This way:

- we don't have to pass the component every time,
- we have an access to the props that were used for rendering,
- we can pass custom props and overwrite the default ones

### Test each

Let's move on to the next test:

```tsx
//Product.spec.tsx
test.each`
	discount | price     | promoAvailable | expectedDiscountPrice
	${20} 	 | ${29.99}  | ${true}        | ${23.99}
	${25}    | ${56.72}  | ${true}        | ${42.54}
	${15}    | ${121.55} | ${true}        | ${103.32}
	${20}    | ${29.99}  | ${false}       | ${23.99}
	${25}    | ${56.72}  | ${false}       | ${42.54}
	${15}    | ${121.55} | ${false}       | ${103.32}
`(
	'shows or does not show the discounted price',
	({ discount, price, promoAvailable, expectedDiscountPrice }) => {
	renderComponent({
		discount,
		product: { ...DEFAULT_PROPS.product, price, promoAvailable },
	});

	if (promoAvailable) {
		expect(screen.getByText(`$ ${expectedDiscountPrice}`)).toBeInTheDocument();
		screen.getByText(`${price}`);
	} else {
		expect(screen.queryByText(`$${expectedDiscountPrice}`)).toBeNull();
		screen.getByText(`$ ${price}`);
	}
);

```

In this test, we are making sure that promotion is applied correctly to a product and that the discounted price is calculated correctly. You can see on the walkthrough gif, that when the user adds the correct promo code, some of the products are getting their price lowered. It's a straightforward scenario:

- if the product can have promo applied to it, we want to check if the old and new price is being rendered
- if the product can't have promo applied to it, we want to check if the regular price is being rendered and the discounted priced is NOT being rendered

To make sure we cover a few cases, we will use [`test.each` function](https://jestjs.io/docs/en/api#testeachtablename-fn-timeout).
Every row of the table that we passed to this method, will be a separate chunk of data used in the same assertions test.

### Function mocking

The last thing we want to cover in this component is testing the callback passed as props. This is an example for our [developer user](https://kentcdodds.com/blog/avoid-the-test-user).

```tsx
//Product.spec.tsx
describe('fires callback on button click', () => {
  test('add button', () => {
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /\\+/i }));
    expect(DEFAULT_PROPS.handleAdd).toBeCalled();
    expect(DEFAULT_PROPS.handleAdd).toBeCalledTimes(1);
    expect(DEFAULT_PROPS.handleAdd).toBeCalledWith(DEFAULT_PROPS.product.id);
  });

  test('subtract button', () => {
    renderComponent({
      product: {
        ...DEFAULT_PROPS.product,
        quantity: 2,
      },
    });
    userEvent.click(screen.getByRole('button', { name: /\\-/i }));
    expect(DEFAULT_PROPS.handleSubtract).toBeCalled();
    expect(DEFAULT_PROPS.handleSubtract).toBeCalledTimes(1);
    expect(DEFAULT_PROPS.handleSubtract).toBeCalledWith(
      DEFAULT_PROPS.product.id
    );
  });

  test('remove button', () => {
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /\\x/i }));
    expect(DEFAULT_PROPS.handleRemove).toBeCalled();
    expect(DEFAULT_PROPS.handleRemove).toBeCalledTimes(1);
    expect(DEFAULT_PROPS.handleRemove).toBeCalledWith(DEFAULT_PROPS.product.id);
  });
});
```

All three tests have almost identical structure and assertions. We could probably use `test.each` again in this situation, but wheres in the previous test we had the same element with different data, here we have different behaviours that just happened to have the same test function body, so it's a good practice to test them separately.

Let's break down the code:

- we render the component
- we use [`userEvent` library](https://github.com/testing-library/user-event) to simulate click event
- we make 3 assertions:
  - has the callback function been called?
  - has the function been called only once?
  - has the function been called with correct product id?

Worth mentioning that, we can check the callback this way because we assign `jest.fn()` to it in the `DEFAULT_PROPS`.

### Cart component

We can start in a similar way as we did with the `Product` component. Let's create a `DEFAULT_PROPS` and `renderComponent` function.

```tsx
//Cart.spec.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart, { Props } from './Cart';
import { mockData } from '../../mock-data';

const DEFAULT_PROPS: Props = {
  ...mockData,
  removeProduct: jest.fn(),
  addProduct: jest.fn(),
  subtractProduct: jest.fn(),
  freeDeliveryPrice: 500,
};

const renderComponent = (props = {}) => {
  return {
    ...render(<Cart {...DEFAULT_PROPS} {...props} />),
    props: {
      ...DEFAULT_PROPS,
      ...props,
    },
  };
};
```

Let's start with the basics and check if products are rendered. We already know that `Product` component is displaying correct info, so here we can just ensure that the `Cart` is actually rendering the products. For each product, let's test if its name is shown.

```tsx
//Cart.spec.tsx
test('shows the correct products', () => {
  renderComponent();
  DEFAULT_PROPS.products.forEach(({ name }) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
```

In our UI we have three main prices - order price (sum of products prices), delivery price and a total price (order + delivery prices). Let's make sure they are calculated and displayed correctly.

### Price testing

```tsx
test('shows the correct order price', () => {
  renderComponent();
  const expectedPrice = 354.65;

  expect(
    screen.getByText(new RegExp(`${expectedPrice}`, 'i'))
  ).toBeInTheDocument();
});
```

We can calculate the price and check if it exists in the document.

```tsx
//Cart.spec.tsx
describe('shows the correct delivery price', () => {
  test('when free delivery price was not exceed', () => {
    renderComponent();
    expect(screen.getByText(/30.00/i)).toBeInTheDocument();
  });

  test('when free delivery price was exceed', () => {
    renderComponent({
      products: [
        ...DEFAULT_PROPS.products,
        {
          id: '5',
          name: 'Blazer',
          color: 'yellow',
          price: 150,
          image: 'images/air-force.png',
          promoAvailable: true,
          quantity: 1,
        },
      ],
    });
    expect(screen.getByText(/free/i)).toBeInTheDocument();
  });
});
```

In our app, the delivery price can have to values - `$30` or `Free`. It is free if the order price exceeds the `freeDeliveryPrice` value (we default it to 500 in `Cart` component). First, we test the situation when the order value is less than 500, in the second we add an additional product to increase the order price and we expect to deliver value to change.

```tsx
//Cart.spec.tsx
describe('shows the correct total price', () => {

  test('when free delivery price was not exceed', () => {
    renderComponent();
    const expectedPrice = 384.65;

      expect(screen.getByText(/in total:/i)).toHaveTextContent(
        new RegExp(`${expectedPrice}`, 'i')
      );
  });

  test('when free delivery price was exceed', () => {
    const { props } = renderComponent({
      products: [
        ...DEFAULT_PROPS.products,
        {
          id: '5',
          name: 'Blazer',
          color: 'yellow',
          price: 150,
          image: 'images/air-force.png',
          promoAvailable: true,
          quantity: 1,
        },
      ],
    });
    const expectedPrice = 504.65;

    expect(screen.getByText(/in total:/i)).toHaveTextContent(
      new RegExp(`${expectedPrice}`, 'i')
    );
  });
```

We're doing a similar thing in this test. In both cases, we calculate the expected total price beforehand (with and without the delivery price) and then we query the UI to see if the correct value is rendered.

### Promo codes

The last functionality we want to test is adding promotion codes. If the user will input the correct code (they are defined in mocked data), the prices will be reduced accordingly. We already tested that in the `Product` component, so this time we can focus on order and total price. Specifically, we want to check 3 things:

- can we apply a valid code
- can we apply an invalid code
- are the prices are updated accordingly

```tsx
//Cart.spec.tsx
test('allows to apply a valid promo code', () => {
  renderComponent();
  const { name, discount } = DEFAULT_PROPS.promoCodes[0];

  userEvent.type(screen.getByRole('textbox'), name);
  userEvent.click(screen.getByRole('button', { name: /apply/i }));

  expect(screen.getByText(/discount applied: /i)).toHaveTextContent(
    discount.toString()
  );
});

test('does not allow to apply invalid promo code', () => {
  renderComponent();

  userEvent.type(screen.getByRole('textbox'), 'INVALID_PROMO_CODE');
  userEvent.click(screen.getByRole('button', { name: /apply/i }));

  expect(screen.getByRole('alert')).toMatchInlineSnapshot();
});

test('updates the prices accordingly when valid promo code is applied', () => {
  renderComponent();

  const { name } = DEFAULT_PROPS.promoCodes[0];

  userEvent.type(screen.getByRole('textbox'), name);
  userEvent.click(screen.getByRole('button', { name: /apply/i }));

  const orderPrice = 314.21;

  expect(
    screen.getByText(new RegExp(`${orderPrice}`, 'i'))
  ).toBeInTheDocument();
  expect(screen.getByText(/in total:/i)).toHaveTextContent(
    new RegExp(`${orderPrice + 30}`, 'i')
  );
});
```

First of all, we want to input the `promoCode` and submit it. We can use `userEvent` library to do both of those tasks.

In the first case, we want to check if the code is correctly applied by querying for the success text and checking its `discount` value.

In the second test, we're inserting an incorrect code and then check for the alert rendered in the UI. This time we want to use this very cool `jest` assertion - `toMatchInlineSnapshot`. I'm not a big fan of snapshot testing, but in this case, it's a perfect match. The alert text can be considered as an implementation detail, so we don't want to hardcode its value. Notice that, after the first run the snapshot will be generated right in the test. If someone is going to change the text of the alert message, the test will catch it and you will have the option to decide if it's correct by updating the snapshot.

The third test is pretty much the copy of previous tests. We just look for an updated order and total price value.

## To sum up

As you can see, testing React applications with Jest and RTL it's really cool and not that complicated. Thanks to them we got a lot of great tools to make sure our applications works as it's expected. Like I've mentioned at the beginning, because of the approach to not to test the implementation details, specs give us a lot of confidence before shipping the app/website/product.

Hope this short article gives you some more understanding of Rect testing and will help you with your future projects. Last one thing at the end, and I can't stress this enough, when in doubt always check [Kent's materials about testing](https://kentcdodds.com/blog/?q=testing). They are great and will definitely help you to answer most of the questions and concerns you have when writing tests.
