// 1.) Create the ceremony for Imports (itr)
import { render, screen } from "@testing-library/react";
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

    // 5.) Verify the text in the element is "/product 1/i" is in the doc, and make the test case async
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    // 6.) Verify that the price is $10. Make sure to `\` the special character in the RegExp.
    // (|$10)
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error for invalid productId", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.json([])));

    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    const message = await screen.findByText(/invalid/i);
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
