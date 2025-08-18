// 3.) Import the {render} function from react-testing-library
// 5.) Import the {screen} object from react-testing-library
import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
// 8.) Import jest-dom for custom matchers
import "@testing-library/jest-dom/vitest";

// 1.) Create test suite for the Greet component
describe("Greet", () => {
  // 2.) Create test case to check if the correct name is rendered when provided
  it("should render Hello with the name when name is provided", () => {
    // 4.) Call the render function w/ the component to be tested and the prop it needs
    render(<Greet name="Craig" />);
    // 6.) use the screen object to find the heading element by it's role
    const heading = screen.getByRole("heading");

    // 7.) Verify the heading is in the doc
    expect(heading).toBeInTheDocument();
    // 8.) Verify the heading contains the right text
    expect(heading).toHaveTextContent(/craig/i);
  });

  // 9.) Duplicate the last test case to check for the login button if no name is provided
  it("should render login button when name is not provided", () => {
    // 10.) Call the render function w/ the component to be tested w/ NO props
    // Because we have to pass no prop, we need to make the name prop optional in #11
    render(<Greet />);

    // 12.) use the screen object to find the button element by it's role
    const button = screen.getByRole("button");

    // 13.) Verify the button is in the doc
    expect(button).toBeInTheDocument();
    // 14.) Verify the button contains the right text
    expect(button).toHaveTextContent(/login/i);
  });
});
