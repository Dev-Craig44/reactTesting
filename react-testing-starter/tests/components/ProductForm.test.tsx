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
    const onSubmit = vi.fn();

    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
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

  it("should call onSubmit with the correct data", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it("should display a toast if submission fails ", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});
    const form = await waitForFormToLoad();
    await form.fill(form.validData);
    const toast = await screen.findByRole("status");

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable the button upon submission", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should re-enable the submit button after form submission fails", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue("error ");

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should display an error is name only displays whitespaces", async () => {
    const { waitForFormToLoad, expectErrorToBeInTheDocument } =
      renderComponent();
    const form = await waitForFormToLoad();

    await form.fill({ ...form.validData, name: "   " });

    expectErrorToBeInTheDocument(/required/i);
  });

  it("should display and error when category is not selected", async () => {
    const { waitForFormToLoad } = renderComponent();
    const form = await waitForFormToLoad();

    await userEvent.click(form.submitButton);
    expect(
      await screen.findByText(/category is required/i)
    ).toBeInTheDocument();
  });

  // 1.) Write failing test for reset button implementation
  it("should reset the form when reset button is clicked", async () => {
    // 2.) Load form
    const { waitForFormToLoad } = renderComponent();
    const form = await waitForFormToLoad();

    // 3.) Fill out form
    await userEvent.type(form.nameInput, "Craig");
    await userEvent.type(form.priceInput, "10");

    // 4.) Pick category
    await userEvent.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    await userEvent.click(options[0]);

    // 5.) Verify data is correct
    expect(form.nameInput).toHaveValue("Craig");
    expect(form.priceInput).toHaveValue("10");
    expect(form.categoryInput).toHaveTextContent(/.+/);

    // 6.) click the reset button
    const resetButton = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(resetButton);

    // 7.) Verify the feilds are clear
    expect(form.nameInput).toHaveValue("");
    expect(form.priceInput).toHaveValue(null);
    expect(form.categoryInput).toHaveTextContent(/cagtegory/i);
  });
});
