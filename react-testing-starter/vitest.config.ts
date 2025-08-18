import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // 1.) Enable globals so we don't have to import them on every single test file
    globals: true,
    // 6.) Reference our setup files so we can use our custom matchers and mock server
    // This setup file is ran before every test file
    setupFiles: "tests/setup.ts",
  },
});
