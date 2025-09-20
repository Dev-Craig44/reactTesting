import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

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
    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should focus on the name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  // 1.) Create test case for an error showing when the name isn't there
  it("should display an error if name is missing", async () => {
    // 2.) Wait for our screen to load and grab our inputs
    const { waitForFormToLoad } = renderComponent();
    // 3.) Don't destructure it, just declare a [form] object
    const form = await waitForFormToLoad();

    // Fill out different form inputs

    // 4.) Create a user
    const user = userEvent.setup();
    // 5.) Make user fill up price input
    await user.type(form.priceInput, "10");
    // 6.) Click the category option
    await user.click(form.categoryInput);
    // 7.) Grab all our options
    const options = screen.getAllByRole("option");
    //  8.) click the first option
    await user.click(options[0]);
    // 9.) Click our submit button
    await user.click(form.submitButton);

    // 10.) Grab our error
    const error = screen.getByRole("alert");
    // 11. Verify that it's in the doc
    expect(error).toBeInTheDocument();
    // 12.) Verify that it has the text content `required`
    expect(error).toHaveTextContent(/required/i);
  });
});
