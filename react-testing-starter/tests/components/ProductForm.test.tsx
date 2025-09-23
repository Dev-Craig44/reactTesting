/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
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
    // 4.) To make our assertion for onSubmit function we need to make the mock function  a constant that's accessible later
    const onSubmit = vi.fn();

    // 5.) Add [onSubmit] to our prop
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        {/* 16.) Add Toaster component in the DOM so our `unexpected error` message can pop up  */}
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      // 6.) Add [onSubmit] to our returned object
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button");

        type FormData = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [K in keyof Product]: any;
        };

        const validData: FormData = {
          id: 1,
          name: "a",
          price: 1,
          // 9.) Match our [categoryId] with the id from our category
          categoryId: category.id,
        };

        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name !== undefined)
            await user.type(nameInput, product.name);

          if (product.price !== undefined)
            await user.type(priceInput, product.price.toString());

          await user.tab();
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
          fill,
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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });

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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  // 1.) Write test case for onSubmit being called with the correct data.
  it("should call onSubmit with the correct data", async () => {
    // 2.) Copy and paste the implementation from our previous test for rendering our component and filling out our form minus the [expect] function
    // 7.) Grab [onSubmit] from the result
    const { waitForFormToLoad, onSubmit } = renderComponent();
    const form = await waitForFormToLoad();
    // 3.) Just pass validData to our function
    await form.fill(form.validData);

    // 10.) Spread our validData, exclude the id, and verify the data w/o it
    // 11.) Disable linting for id, because we are not using it
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData;
    // 8.) Verify the onSubmit is called w/ the [validData]
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  // 12.) Make test case for if submission fails
  it("should display a toast if submission fails ", async () => {
    // 13.) Copy and paste lines from our previous test
    const { waitForFormToLoad, onSubmit } = renderComponent();
    // 14.) Program our mock to simulate a failure. The value doesn't matter because we just want it to return a rejected promise.
    onSubmit.mockRejectedValue({});
    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    // 15.) Call screen.debug because we don't know how our toast is going to get rendered
    // screen.debug();

    // 17.) Because we see that the toast is render in a role called [status], let's findbyrole and store it in a [toast] variable
    const toast = await screen.findByRole("status");

    // 18.) Verify that the toast is in the doc, and has the unexpected error text
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });
});
