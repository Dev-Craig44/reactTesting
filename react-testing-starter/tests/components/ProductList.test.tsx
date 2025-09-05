import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
// 7.) Import the delay method from mock service worker
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductList", () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    console.log("afterAll called...");
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product is found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));

    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  // 1.) Create test case for when there is no products
  it("should render an error message when there is an error", async () => {
    // 2.) Simulate a no response by using the {use} on the server object. Instead of {json} we will call {error} on the request handler.
    server.use(http.get("/products", () => HttpResponse.error()));

    // 3.) Render our component
    render(<ProductList />, { wrapper: AllProviders });

    // 4.) Because the message will pop up asynchronuosly we fill findByText and verify it will be in the document
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  // 5.) Write test case for the loading message when fetching data
  it("should render a loading indicator when fetching data", async () => {
    // 6.) Call our server object, but instead of just creating a sever response, we will create a delay
    server.use(
      http.get("/products", async () => {
        // 8.) Call the delay method
        await delay();
        // 9.) Give the response an empty array because we are really not testing the response right now
        return HttpResponse.json([]);
      })
    );

    // 10.) Render our component
    render(<ProductList />, { wrapper: AllProviders });

    // 11.) Use findByText to match the `loading` word and verify that it is in the document, and make sure that this test case is async.
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  // 12.) Create test case for when data fetching is over, the loading indicator should be gone
  it("should remove the loading indicator after data is fetch", async () => {
    // 13.) Render ProductList component
    render(<ProductList />, { wrapper: AllProviders });

    // 14.) Use new react testing element to wait for the loading element to be removed. This returns a promise so await and make test case async.
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  // 15.) Duplicate last test case for loading indicator to be removed if the data fetching fails.
  it("should remove the loading indicator if data fetching fails", async () => {
    // 16.) Send a server response of an error
    server.use(http.get("/products", () => HttpResponse.error()));

    // 17.) Render the component
    render(<ProductList />, { wrapper: AllProviders });

    // 18.) Use the react testing element to make sure the loading element is removed
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
