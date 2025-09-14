// 1.) Import ceremony
import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";

// 2.) Create test suite
describe("ProductForm", () => {
  // 3.) Create test case for correct form fields
  it("should render form fields", async () => {
    // 4.) Render our component
    // Make sure to check the component to see what props it has.
    // 5.) Pass onSubmit a mock function because we dont' care about form submission
    // #7 Error: No QueryClient set, use QueryClientProvider to set one
    // 7.) Wrap component in our providers component
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    // 6.) Verify that the name text is in the field
    // 8.) TestingLibraryElementError: Unable to find an accessible element with the role "textbox" and name `/name/i`
    // 8.) Change getByRole to findByRole, await it, and change the test to async. We got the error because we start off with the loading indicator so we have to wait for it.
    expect(
      await screen.findByRole("textbox", { name: /name/i })
    ).toBeInTheDocument();
  });
});
