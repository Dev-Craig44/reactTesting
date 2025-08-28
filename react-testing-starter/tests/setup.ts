import "@testing-library/jest-dom/vitest";
import ResizeObsever from "resize-observer-polyfill";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.ResizeObserver = ResizeObsever;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
// Our tests our not ran in a browser envirnoment, they are run inside a node environment.
// We installed jsDOM to simulate a browser environment, now in that environment our window object doesn't have the marchMedia prop, which is a common issue you might face as part of testing react applications.
// Whenever changing things in the setup.ts file, always restart vitest.
// 12.) Plug this code in.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
