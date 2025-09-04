import { render, screen } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  // 1.) Create a database to render before all our tests
  beforeAll(() => {
    // 2.) Delcare [product] using the {create} method on db's {product} method
    const product = db.product.create();
    // 3.) Store the product id created into [productID]
    productId = product.id;
  });

  // 4.) Create a clean up after our tests are completed
  afterAll(() => {
    // 5.) Use db's {product} method's {delete} method. Give it an object of where, id, equals: (our productId)
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product details", async () => {
    // 6.) Use findFirst() to find the product that equals the productId and store it in [product]
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    // 7.) Use [product] to verify the name. Use a `!` because we KNOW the product is not null
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      // 8.) Use [product] to verify the price. Use a `!` because we KNOW the product is not null
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
