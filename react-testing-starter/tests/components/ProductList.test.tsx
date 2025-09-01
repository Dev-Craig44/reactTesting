// 2.) Import ceremony `itr`
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
// Because we need to override our mock database to return an empty database we need to use the serve module that wwe created in the mocks folder.
//  10.) Import http & HttpResponse from msw
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

// 3.) Create test suite for ProductList
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

  // 4.) Create a test case where it should render the products list correctly
  it("should render the list of products", async () => {
    // 5.) Render the ProductList
    render(<ProductList />, { wrapper: AllProviders });

    // 6.) Declare [items] using the async `Find`byall and listitem is the element
    const items = await screen.findAllByRole("listitem");
    // 7.) Verify that the items is  more than 0
    expect(items.length).toBeGreaterThan(0);
  });

  // 8.) Write test case for if there are no products
  it("should render no products available if no product is found", async () => {
    // 11.) Call the {use} method on the server object and pass it a new request handler (Give it a response). (Same as in the one in the handlers file)
    server.use(http.get("/products", () => HttpResponse.json([])));

    // 9.) Render our ProductList component
    render(<ProductList />, { wrapper: AllProviders });

    // 12.) Use findByText to grab the message on the screen and declare [message]
    const message = await screen.findByText(/no products/i);
    // 13.) Verify that the [message] is in the doc
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator after data is fetch", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator if data fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
