import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  // 1.) Move rendeting function outside of our function
  // 5.) Give it our product variable and annotate it w/ type Product. Give the optional operator because we don't need it in the first test case.
  const renderComponent = (product?: Product) => {
    // 2.) Movw rendering logic up to this helper function
    // 6.) Pass the product as a prop to our component.
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    // 7.) Return an object
    return {
      // 8.) declare our waitForFormToLoad function
      waitForFormToLoad: () => screen.findByRole("form"),
      // 15.) Create a function that returns an object with all our inputs
      getInputs: () => {
        return {
          // 12.) Add the nameInput function
          // 14.) defer nameInput rendering
          nameInput: screen.getByPlaceholderText(/name/i),
          // 16.) Add priceInput
          priceInput: screen.getByPlaceholderText(/price/i),
          // 17.) Add categoryInput
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
    };
  };

  it("should render form fields", async () => {
    // 3.) Call the render function
    // 9.) Destruct the component and grab our wait function
    // 18.) Replace w/ getInputs
    const { waitForFormToLoad, getInputs } = renderComponent();

    // 10.) replace our logic with our helper function
    await waitForFormToLoad();
    // 13.) replace old logic with nameInput function
    // Because nameInput is render when the renderComponent is rendered we need to turn it into a function
    // 19.) Call input helper and destructure the inputs we need
    const { nameInput, priceInput, categoryInput } = getInputs();

    // 20.) Replace all input logic with our helpers
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };
    // 4.) Replace this with our render function and give it our [product].
    // 11.) Grab hour helper function and replace it with it's old implementation
    // 21.) grab inputs helper function
    const { waitForFormToLoad, getInputs } = renderComponent(product);

    // 11.)
    await waitForFormToLoad();

    // 22.) Call inputs helper and destructure our inputs, and replace old logic
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });
});
