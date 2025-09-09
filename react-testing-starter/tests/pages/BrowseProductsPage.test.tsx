// 1.) Import ceremony `itr`
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProviders from "../AllProviders";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../Utils";

//RENDERING TESTS

// 2.) Create test suite for BrowseProductsPage
describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      // 5.) Store the created category in a `category` variable
      const category = db.category.create();
      categories.push(category);
      // 7.) Make atleast to products for each category
      [1, 2].forEach(() => {
        products.push(
          db.product.create({
            // 6.) Set `categoryId` to [category.id]
            categoryId: category.id,
          })
        );
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({
      where: { id: { in: productIds } },
    });
  });

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategorySkeleton } = renderComponent();

    expect(getCategorySkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    const { getCategorySkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    // 2.) Pass our helper function here, but call it because we need an element in the expect function.
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should fail silently if categories cannnot be fetched", async () => {
    simulateError("/categories");

    const { getCategorySkeleton, combobox } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(combobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategorySkeleton, combobox, user } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    expect(combobox()).toBeInTheDocument();

    await user.click(combobox()!);

    categories.forEach((c) => {
      expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: c.name })).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  // 1.) Create a test case for filtered
  it("should filter products by category", async () => {
    // 2.) Call the renderComponent and grab our helper props we made
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    // 8.) Declare `selectedCategory` from the first element in the categories.
    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  // 12.) Duplicate test case to verify all prducts are there if all is selected
  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const user = userEvent.setup();

  const getCategorySkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const combobox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategorySkeleton);
    await user.click(combobox()!);

    const option = screen.getByRole("option", { name });
    await user.click(option);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    // 9.) Slice out the first row (the header) so it’s excluded from the data rows
    const dataRows = rows.slice(1);
    // 10.) Verify that the data rows have the right amount of rows
    expect(dataRows).toHaveLength(products.length);

    // 11.) Verify that our products are in the document
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    selectCategory,
    getProductsSkeleton,
    getCategorySkeleton,
    combobox,
    user,
    expectProductsToBeInTheDocument,
  };
};
