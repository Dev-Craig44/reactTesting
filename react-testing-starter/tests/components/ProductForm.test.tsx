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
    // 8.) Change findByRole to findByPlaceholderText because with this we can also check the text in the input field
    expect(await screen.findByPlaceholderText(/name/i)).toBeInTheDocument();

    // 11.) Check to see if we have the price input field. Change find to get because by the time we wait for the name input everything will be up, so we can just verify it at this point
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
  });
});
