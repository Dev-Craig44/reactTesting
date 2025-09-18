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
      // 12.) Add the nameInput function
      // 14.) defer nameInput rendering
      getNameInput: () => screen.getByPlaceholderText(/name/i),
    };
  };

  it("should render form fields", async () => {
    // 3.) Call the render function
    // 9.) Destruct the component and grab our wait function
    const { waitForFormToLoad, getNameInput } = renderComponent();

    // 10.) replace our logic with our helper function
    await waitForFormToLoad();
    // 13.) replace old logic with nameInput function
    // Because nameInput is render when the renderComponent is rendered we need to turn it into a function
    expect(getNameInput()).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
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
    const { waitForFormToLoad } = renderComponent(product);

    // 11.)
    await waitForFormToLoad();

    expect(await screen.findByPlaceholderText(/name/i)).toHaveValue(
      product.name
    );

    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      product.price.toString()
    );

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });
});
