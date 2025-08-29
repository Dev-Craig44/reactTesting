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
