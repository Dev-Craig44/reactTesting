// 1.) Create the ceremony for the imports
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermsAndConditions from "../../src/components/TermsAndConditions";

// 2.) Create test suite for TermsAndConditions component
describe("TermsAndConditions", () => {
  // 4.) Because we are going to be using the same elements in multiple tests, create a helper function to render the conponent and return the elements we need
  const renderComponent = () => {
    // 5.) Render the component
    render(<TermsAndConditions />);

    // 6.) Return all the elements we need for our tests
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };

  // 3.) Create the test case for the component redering with the correct text and initial state
  it("should render with correct text and initial state", () => {
    // 7.) Call the helper function and destructure the returned elements
    const { heading, checkbox, button } = renderComponent();

    // 8.) Verify that the heading matches the expected text
    expect(heading).toHaveTextContent(/terms & conditions/i);
    // 9.) Verify that the checkbox is not checked
    expect(checkbox).not.toBeChecked();
    // 10.) Verify that the button is disabled
    expect(button).toBeDisabled();
  });

  // 11.) Create a test case for user interaction w/ the checkbox
  it("should enable the button when the checkbox is checked", async () => {
    // Arrange
    // 12.) Call helper fucntion to render the component and destructure the elements
    const { checkbox, button } = renderComponent();

    //Act
    // 13.) Declare a user by calling the userEvent.setup() function
    const user = userEvent.setup();
    // 14.) Simulate a user clicking the checkbox. Pay attention to the return type of the click method. It returns a promise, so we have to await it, and make our test case async
    await user.click(checkbox);

    //Assert
    // 15.) Verify that the checkbox is checked
    expect(button).toBeEnabled();
  });
});
