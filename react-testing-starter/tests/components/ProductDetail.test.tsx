import { render, screen } from "@testing-library/react";
// 7.) Import the delay method
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    // 8.) Wrap this component in the AllProviders component
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });
  it("should render message if product not found", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.json(null)));

    // 9.) Wrap this component in the AllProviders component
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error for invalid productId", async () => {
    // 10.) Wrap this component in the AllProviders component
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    const message = await screen.findByText(/invalid/i);

    expect(message).toBeInTheDocument();
  });

  // 1.) Create test for there is nothing found
  it("should render an error if data fetching fails", async () => {
    // 2.) Copy the server response and change the response to error()
    server.use(http.get("/products/:id", () => HttpResponse.error()));

    // 3.) Render our component
    // 11.) Wrap this component in the AllProviders component
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    // 4.) Use the findByText method to verify that the word `error` is in the document
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  // 5.) Create test case for loading indicator rendering when fetching data
  it("should render a loading indicator when fetching data", async () => {
    // 6.) Create a server response to the product endpoint
    server.use(
      http.get("/products/1", async () => {
        // 8.) Use the delay method to create a delay
        await delay(100);
        // 9.) Give an empty array as the response because we just care about the loading element, not the response.
        return HttpResponse.json([]);
      })
    );

    // 10.) Render the ProductDetail component
    // 12.) Wrap this component in the AllProviders component
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    // 11.) Use the screen.findByText method to match the loading word and verify it is in the document.
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
