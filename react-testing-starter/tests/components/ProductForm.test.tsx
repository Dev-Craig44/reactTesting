/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
      // 17.) Create our error helper function
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        // 18.) Paste the logic inside the body of the function
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        // 5.) Move input logic outside of the returned object so we can use it for our fill method
        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button");

        // 10.) Annoted different type for our Product so it can cover more than
        type FormData = {
          // 11.) iterate over all the keys of the product. typescript doens't likethe any type, but it's ok in this situation. Just disable the rule for this line.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [K in keyof Product]: any;
        };

        // 13.) Create a object that contains all the data for the form
        const validData: FormData = {
          id: 1,
          name: "a",
          price: 1,
          categoryId: 1,
        };

        // 6.) Define our fill method outside outside our object
        // 4.) Make this function async
        // 12.) Change the product type to the one wwe just created
        const fill = async (product: FormData) => {
          // 3.) Paste the implementation we just copied
          const user = userEvent.setup();
          // 7.) Remove the [form] variable name from our input methods/props

          // 8.) Set name to product.name & price
          if (product.name !== undefined)
            // 16.) Disable all of these linting issues because we know what we're doing
            await user.type(nameInput, product.name);

          if (product.price !== undefined)
            await user.type(priceInput, product.price.toString());

          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          // 2.) Create a helper function for filling out our form
          fill,
          // 14.) Add our validData Object to our returned object
          validData,
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

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255 /,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      // 21.) Grab our error verification function
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      // 15.) Call our form fill function, spread our validData object, add the name, and await it
      await form.fill({ ...form.validData, name });

      // 1.) Copy all this logic for filling out a form
      // 16.) Delete All of this logic

      // 22.) Call our error verification function and pass it the error message
      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "0",
      price: "0",
      errorMessage: /1/,
    },
    {
      scenario: "negative",
      price: "-1",
      errorMessage: /1/,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/,
    },
    {
      scenario: "greater than 1000",
      price: "1001",
      errorMessage: /1000/,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      // 19.) Grab our error function
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      // 9.) Add our form fill helper
      // 15.) Spread our validData object and overwrite what we want to specifically test
      await form.fill({ ...form.validData, price });

      // 20.) Call our error function and pass it the [errorMessage]
      expectErrorToBeInTheDocument(errorMessage);
    }
  );
});
