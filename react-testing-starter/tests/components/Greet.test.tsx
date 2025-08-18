// 2.) Because we switched the congfig setting to use globals, we don't need to import `describe`, `it`, and `expect` in every test file
// 7.) Type `itr` to import { render, screen } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
// 4.) Move this line of code to the setup.js file so we don't have to import it to get our custom matchers

describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {
    render(<Greet name="Craig" />);
    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/craig/i);
  });

  it("should render login button when name is not provided", () => {
    render(<Greet />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
