// 1.) Create the ceremony for Imports (itr)
import { render, screen } from "@testing-library/react";
// 8.) Import http & HttpResponse
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

// 2.) Create test suite for ProductDetail
describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  // 3.) Write test case for products rendering correctly
  it("should render the product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    // 4.) Render the ProductDetail component and give the productId prop the Id of `1`
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    // 5.) Verify the text in the element by giving the matcher a RegExp so we don't give it an exact string. (new RegExp(products[0].name))
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    // 6.) Verify that the price is $10. Do same by changing the hard codied values w/ a new RegExp(products[0].price.toString()). We're toString() because products[0].price comes out as a number
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });
  // 7.) Write test for message if product isn't found
  it("should render message if product not found", async () => {
    // We need to overwrite the handler for fetching a particular product #8
    // 9.) Create a request handler that returns null
    server.use(http.get("/products/:id", () => HttpResponse.json(null)));

    // 10.) Render the component again w/ productId prop set to `1`
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    // 11.) Declare a [message] variable using the findByText method because the message will pop up asynchronuosly.
    const message = await screen.findByText(/not found/i);
    // 12.) Verify this [message] is in the doc
    expect(message).toBeInTheDocument();
  });

  // 13.) Duplicate last test case in case productId is 0
  it("should render an error for invalid productId", async () => {
    // We don't need to mock a database response so we can get rid of this server response

    // 14.) Render the ProductDetail component with productId of 0
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    // 15.) Since the invalid message will come up asynchronuosly use the find text method to delcare the [message] variable
    const message = await screen.findByText(/invalid/i);

    // 16.) Verify that this message is in the doc
    expect(message).toBeInTheDocument();
  });

  it("should render an error if data fetching fails", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.error()));

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay(100);
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
