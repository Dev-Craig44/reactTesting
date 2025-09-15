import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  // 9.) Keep track of our category by delcaring the variable
  let category: Category;
  // 7.) Create a [category] set up to run before all of our tests
  beforeAll(() => {
    // 8.) Create the [category]
    category = db.category.create();
  });

  // 10.) Create a setup for after our tests run
  afterAll(() => {
    // 11.) Use our delete logic
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole("form");

    expect(await screen.findByPlaceholderText(/name/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });

  // 1.) Create test for populated form fields
  // 3.) Because we are using await, make our test case async
  it("should populate form fields when editing a product", async () => {
    // 4.) Create a product object
    const product: Product = {
      // 5.) Create arbitrary values
      id: 1,
      name: "Bread",
      price: 10,
      // 6.) Create valid cagtegory to use here
      // 12.) Set [categoryId] to our category.id
      categoryId: category.id,
    };
    // 2.) Copy & paste implementation from previous test case
    // 13.) Pass our [product] as a prop to our component
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    await screen.findByRole("form");

    //  14.) Change the tbid to toHaveValue and pass our product.name
    expect(await screen.findByPlaceholderText(/name/i)).toHaveValue(
      product.name
    );

    // 15.) Do the same with this one but for the price now.
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      product.price.toString()
    );

    // 16.) Verify the text inside the span in the button has the right text
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });
});
