# Testing React Apps

This is the starter project for my Reacting testing course where you'll learn everything you need to know to effectively test React apps. You can find the full course at:

https://codewithmosh.com

## About this Project

This is a React app built with the following technologies and libraries:

- Auth0
- Tailwind
- RadixUI
- React Router
- React Query
- Redux Toolkit

Please follow these instructions carefully to setup this project on your machine.

## Setting up Auth0 for Authentication

1. **Sign up for an Auth0 Account:**

   If you don't already have an Auth0 account, you can sign up for one at [https://auth0.com/](https://auth0.com/). Auth0 offers a free tier that you can use for your project.

2. **Create a New Application:**

   - Log in to your Auth0 account.
   - Go to the Auth0 Dashboard.
   - Click on "Applications" in the left sidebar.
   - Click the "Create Application" button.
   - Give your application a name (e.g., "My React App").
   - Select "Single Page Web Applications" as the application type.

3. **Configure Application Settings:**

   - On the application settings page, configure the following settings:
     - Allowed Callback URLs: `http://localhost:5173`
     - Allowed Logout URLs: `http://localhost:5173`
     - Allowed Web Origins: `http://localhost:5173`
   - Save the changes.

4. **Obtain Auth0 Domain and ClientID:**

   - On the application settings page, you will find your Auth0 Domain and Client ID near the top of the page.
   - Copy the Auth0 Domain (e.g., `your-auth0-domain.auth0.com`) and Client ID (e.g., `your-client-id`).

5. **Create a `.env.local` File:**

   - In the root directory of the project, you'll find a sample `.env` file. Make a copy and save it as `.env.local`.
   - Replace the Auth0 Domain and Client ID with the actual values you obtained from Auth0.

## Running the App

Now that you have set up Auth0 and configured your environment variables, you can run the React app using the following commands:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

This will start the back-end process at `http://localhost:3000`. If port 3000 is in use on your machine, update the port number in the following files and run `npm start` again:

- json-server.json
- src/main.tsx

**Needed to make git stop tracking the subfolder**

`rm -rf .git`

### 📝 Git Nested Repo Fix

I accidentally cloned a repository into a subfolder of my main project.  
That subfolder had its own `.git` folder, so when I initialized Git in the root,  
Git treated the subfolder as a **separate repo (submodule)** instead of tracking its files.

When I later deleted the `.git` inside the subfolder, the files still didn’t show up as changes in the root repo, because Git was only storing a pointer to the submodule.

**Fix:** I ran the following command in the root repo:

```bash
git rm --cached subfolder_name


```

## Testing Components

When testing React components, there are two main concerns:

- **How components render**
- **How they respond to user actions**

In React testing, we typically focus on **integration testing**:

- It is slower than unit testing
- Provides greater confidence in your code
- Is generally more robust

The goal is to test the **behavior** of your components, not their `style`.

## Testing User Interactions

- To simulate user interactions we have to use a different libraty called user-event.

- To install this we have to use `npm install --save-dev @testing-library/user-event`

- Using `qt` & `qtr` to get the screen.getByText()

### Exercise: Testing Search Box

## Passing Functions in React

Sometimes when using callbacks (like `onChange`), you don’t need to wrap the target function in an arrow. If the arrow function simply receives a parameter and immediately forwards it, you can pass the function reference directly.

---

### ✅ Example: Direct Function Reference

```jsx
// Instead of writing this:
onChange={(value) => console.log(value)}

// You can just write:
onChange={console.log}
```

## Working with Component Libraries

- Since **jsDOM** (used in test environments) does not provide `ResizeObserver` — which is available in browsers — we need to install a polyfill to avoid errors.

### Install the Polyfill

```bash
npm i -D resize-observer-polyfill
```

## 🔎 Shortcut: Navigate Symbols in VSCode

- Press **CMD + P** (Mac) or **CTRL + P** (Windows/Linux).
- Type `@` to see all **symbols** (functions, classes, variables) defined in the current module.
- This lets you quickly jump to any symbol without scrolling through the file.

## SUMMARY:

## 🧪 Testing React Components

When testing React components, there are two main goals:

1. **Rendering** – making sure the component displays correctly.
2. **Responding to user actions** – ensuring interactions work as expected.

### ✅ Best Practices

- Write tests that are **maintainable, robust, and trustworthy**.
- Test **behavior** (what the app does), not **implementation details** (how it’s done).
- **Don’t test styles** — small visual changes can break fragile tests, and passing style tests don’t guarantee good UI.
- Use **setup files** to configure the testing environment before each test file runs.
- Use [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/) to simulate realistic user interactions.

### 🔍 Query Methods

React Testing Library provides flexible queries for finding elements:

- **getBy** – throws an error if element not found.
- **queryBy** – returns `null` instead of error if element not found.
- **findBy** – async, waits for element to appear.

#### Variations

- `ByRole`
- `ByText`
- `ByPlaceholderText`
- `ByTestId`

### 🧰 Useful Matchers

Some helpful Jest matchers for React components:

- `toBeChecked()`
- `toBeDisabled()`
- `toBeEmptyDOMElement()`
- `toBeInTheDocument()`
- `toHaveAttribute()`
- `toHaveTextContent()`

### 👩‍💻 Simulating User Interactions

```js
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.click(element);
await user.type(element, "a");
```

# 🌐 Mocking APIs

In this section, we’ll learn how to test components and functions that rely on external APIs — without making real network requests. This makes tests **fast, reliable, and isolated**.

---

## 🎯 You’ll Learn

- **Mock Service Worker (MSW)**  
  Use MSW to intercept `fetch` or `XHR` requests and return mocked responses in your test environment.

- **Testing Data Fetching**  
  Verify that components display the correct data when the API call succeeds.

- **Testing Error Handling**  
  Simulate failed API calls (e.g., `500` server error, network failure) to ensure your UI handles errors gracefully.

- **Testing Loading Indicators**  
  Check that loading states (like spinners or “Loading…” messages) appear while the request is in progress.

---

## 🧠 Why Mock APIs?

- Keeps tests **deterministic** — no flakiness from real servers.
- Faster than hitting real endpoints.
- Lets you simulate **any response**: success, error, empty data, delays, etc.
- Ensures UI logic is well-tested under different scenarios.

---

## 🚀 Example (with MSW)

```js
// handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("/api/user", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1, name: "Craig" }));
  }),
];
```

## 🛠️ Setting Up Mock Service Worker (MSW)

```ts
// 1. Install MSW
// Run this in your terminal:
// npm i -D msw@latest

// 2. Add tests/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Beauty" },
      { id: 3, name: "Gardening" },
    ]);
  }),
];

// 3. Add tests/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// 4. Configure setupTests.ts
import { server } from "./mocks/server";

beforeAll(() => server.listen()); // Start server before all tests
afterEach(() => server.resetHandlers()); // Reset handlers after each test
afterAll(() => server.close()); // Clean up after all tests

// 5. Verify setup with a test (e.g., main.test.ts)
test("fetches categories", async () => {
  const response = await fetch("/categories");
  const data = await response.json();

  console.log(data); // -> Should log 3 categories
  expect(data).toHaveLength(3);
});

// 🔑 Key Takeaways
// - Don’t mock Axios/Fetch directly → it couples tests to implementation
// - Centralize mocks in handlers.ts → define responses once
// - Lifecycle hooks (beforeAll, afterEach, afterAll) keep tests isolated
// - MSW = realistic, browser-like API mocking without hitting real servers
```

## 🎲 Generating Fake Data with Faker.js

[**Faker.js Documentation →**](https://fakerjs.dev)

Hardcoding test data isn’t scalable. **Faker.js** helps generate fake but realistic values for testing and development.

### 📦 Installation

$ npm i -D @faker-js/faker

### 🔌 Import

import { faker } from "@faker-js/faker";

### 🛍️ Example: Fake Product

const product = {
name: faker.commerce.productName(),
price: faker.commerce.price({ min: 1, max: 100 }), // returns string
};
console.log(product);

// ✅ Sample output
// { "name": "Fantastic Plastic Tuna", "price": "72.00" }

// ⚠️ Note: `price` is returned as a string, not a number. Use Number() if needed.

### 🌐 Faker Modules

- airline → flight-related data
- internet → domains, emails, emojis
- animal → animals
- location → countries, cities, latitude/longitude
- color → colors
- commerce → products, prices

### 🧠 Why Use Faker?

- Avoids hard-coded fixtures → more maintainable tests
- Generates realistic, randomized inputs → better coverage
- Great for mock APIs, seed scripts, and UI testing

### 🔑 Key Takeaways

- Faker makes tests cleaner and scalable
- Seed Faker for deterministic results:
  faker.seed(123);
- Use alongside MSW or other mocks for end-to-end fake data flows

## 🗄️ Mock Service Worker Data (MSW Data)

MSW has a companion library called **@mswjs/data**. It provides an in-memory database with a simple interface to **model data and query it** — similar to how you’d interact with a real database. Used properly, it simplifies tests; used poorly, it can create global state issues.

---

### 📦 Installation

$ npm i -D @mswjs/data@0.16.1

---

### 🏗️ Setting Up a Database

Create `tests/mocks/db.ts`:

# 🏷️ How to Properly Tag a Commit in This Repo

This repository is dedicated to **Testing React Apps with React Testing Library**. To keep track of progress by section, use **annotated Git tags** with a consistent naming convention.

## Tagging Convention

- **Prefix all tags with:** `tra-` (short for Testing React Apps)
- **Number each section in order:** `01`, `02`, `03`, …
- **Use kebab-case for section names**

**Examples:**

- `tra-01-testing-react-components`
- `tra-02-mocking-apis`
- `tra-03-error-handling`

## How to Tag a Commit

1. **Create an annotated tag with a descriptive message:**

   ```sh
   git tag -a tra-01-testing-react-components -m "Completed Section 1: Testing React Components"

   git push origin tra-01-testing-react-components
   ```

## Refactoring: Using React Query

- React Query
- A state-management library for React apps
- Caching
- Background updates
- Automatic retries

## Wrapping Components for Testing

Create `tests/AllProviders.tsx`:

## 📝 Using `it.todo` in Tests

In Jest/Vitest, `it.todo` is a way to mark a test as **planned but not yet implemented**.  
Think of it like a sticky note in your code — it’s a placeholder that reminds you what needs to be tested later.

### ✅ Example

```ts
describe("User login", () => {
  it("should allow login with valid credentials", () => {
    // test code here
  });

  it.todo("should reject login with an invalid password");
  it.todo("should lock account after 3 failed attempts");
});
```

## 🐞 Debugging: `getItem is not a function`

While testing the **BrowserProductsPage** component, the following error appeared:

---

### 🔎 Investigation

1. **Search the codebase**  
   Use the shortcut **Shift + CMD + F** to search for `getItem`.  
   This shows that `getItem` is provided as a **prop** from the `useCart` hook.

2. **Trace the context**

   - In `QuantitySelector`, `getItem` is expected to come from the cart context.
   - By checking `App.tsx`, we see that the component tree includes a **CartProvider**.
   - The `CartProvider` supplies `getItem` to any children using `useCart`.

3. **Root cause**  
   The error occurred because the test (or component usage) did **not wrap** `BrowserProductsPage` in the `CartProvider`.  
   Without the provider, `useCart` returns an undefined context, so `getItem` isn’t available.

---

### 🛠️ Fix

Wrap your component (or test render) with the **CartProvider**:

```tsx
import { render } from "@testing-library/react";
import { CartProvider } from "../cart/CartProvider";
import QuantitySelector from "./QuantitySelector";

const renderComponent = () => {
  render(
    <CartProvider>
      <BrowserProductsPage />
    </CartProvider>
  );
};
```

## ⏪ How to Jump Back and Forth in Your Code (Cursor History)

In VS Code (and most modern editors), you can quickly move your cursor back to where it was before — almost like “undo/redo” for navigation.

- **Jump Backward**:  
  <kbd>Ctrl</kbd> + <kbd>-</kbd> (Windows/Linux)  
  <kbd>Cmd</kbd> + <kbd>-</kbd> (Mac)

- **Jump Forward**:  
  <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>-</kbd> (Windows/Linux)  
  <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>-</kbd> (Mac)

This is super handy when you’re jumping between definitions, test files, or large components and want to return to where you were editing.

## 📊 Code Coverage

Code coverage helps you measure how much of your code is exercised by your test suite.  
With **Vitest**, you can add a coverage script to your `package.json`.

---

### 📝 Add Coverage Script

```json
"scripts": {
  "coverage": "vitest run --coverage"
}
```

## 🔍 Viewing the Coverage Report

Follow these steps to open the report:

1. Go to the `coverage/` folder in your project.
2. Highlight the `index.html` file.
3. Press **Ctrl + Cmd + R** (Mac) to reveal the file in Finder.
   - On **Windows/Linux**: right-click `index.html` → **Show in Explorer/File Manager**.
4. Drag and drop `index.html` into your browser window.

You’ll now see a detailed report showing which lines, branches, and functions are covered by your tests.

## 📚 Mocking APIs — Summary

**The Complete React Testing Course**  
© 2024 Code with Mosh (codewithmosh.com)

---

- **Mock Service Worker (MSW)**  
  A library that intercepts HTTP requests made by your application, allowing you to mock server responses for testing purposes.

- **@mswjs/data**  
  A companion library for MSW that provides an in-memory database. It lets you model entities, create relationships, and generate handlers automatically for REST or GraphQL APIs.

- **Faker (@faker-js/faker)**  
  A library for generating fake (but realistic) data, such as product names, prices, emails, and more. Useful for seeding mocks and creating test data.

- **React Query**  
  A library for managing server state in React applications. It offers powerful features out of the box:

  - Caching
  - Automatic retries
  - Automatic syncing
  - Background refetching

- **Reusable Utilities**  
  Extract common test utilities (e.g., rendering, simulating API errors, delays). This makes test code more concise and easier to understand.

- **Code Coverage Before Refactoring**  
  Always run coverage before refactoring production code to ensure all logic is covered by tests. This provides a safety net and reduces the chance of regressions.

## ✅ What To Test

When writing tests for forms and interactive components, focus on two main areas: **Rendering** and **User Actions**.

---

### 1️⃣ Rendering

- **Correct input fields** — Ensure the right fields are present (text inputs, checkboxes, selects, etc.).
- **Default values** — Verify that fields have the expected initial state.
- **Initial data** — Confirm that preloaded data (e.g., editing an existing form) is displayed correctly.
- **Dropdown options** — Check that the correct options are available in select menus.

---

### 2️⃣ User Actions

- **Field interactions** — Example: toggling a checkbox disables/enables a related button.
- **Validation rules** — Catch edge cases such as:
  - Out-of-range numbers
  - Extremely long strings
  - Special characters
- **Form submission** — Ensure that submitting the form sends the correct information.
- **Form feedback & UX** — Test the user experience:

  - Submit button disables during submission
  - Loading spinner appears
  - Toast/notification message confirms success

  ## Extracting a function for filling forms

  When writing tests for forms, it's common to have repeated code for filling out input fields. To keep your tests clean and DRY, extract a helper function that fills the form fields with test data. This makes your tests easier to read and maintain.

  **Example:**

  ```ts
  // utils/testHelpers.ts
  export function fillForm({ name, email }, screen, user) {
    user.type(screen.getByLabelText(/name/i), name);
    user.type(screen.getByLabelText(/email/i), email);
  }
  ```

  You can then use this helper in your test files:

  ```ts
  import { fillForm } from "./utils/testHelpers";

  test("submits the form", async () => {
    render(<MyForm />);
    const user = userEvent.setup();

    fillForm({ name: "Alice", email: "alice@example.com" }, screen, user);

    await user.click(screen.getByRole("button", { name: /submit/i }));
    // assertions...
  });
  ```

  ### Why `user.tab()` before typing?

  In tests, `user.type()` expects the element to already be focused.  
  If it isn’t, React triggers focus updates outside its normal render cycle, which causes an `act(...)` warning.

By calling `user.tab()` before typing, we simulate a real user moving focus into the field first.  
This removes the warning and makes the test flow closer to real keyboard navigation.
