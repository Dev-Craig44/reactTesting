// 1.) Import { screen, render } w/ typing `itr`
import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

// 2.) Create test suite for UserAccount
describe("UserAccount", () => {
  // 3.) Write test case for rendering a name
  it("should render user name", () => {
    // 4.) Create a user object, annotate it w/ it's type
    const user: User = { id: 1, name: "Mosh" };

    // 5.) Render UserAccount and give it the user object
    render(<UserAccount user={user} />);

    // 6.) Use screen.getByText to check if the name is in the doc. This returns an element, but we're only going to use it once, so we'll use it directly.
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  // 7.) Duplicate the test case for the editg button
  it("should render edit button if user is admin", () => {
    const user: User = { id: 1, name: "Mosh", isAdmin: true };

    render(<UserAccount user={user} />);

    // 8.) We're going to use screen.getByRole to find the button and store it in a variable because we are going to write two assertions against this object.
    const button = screen.getByRole("button");

    // 9.) Verify that the button is in the doc.
    expect(button).toBeInTheDocument();
    // 10.) Verify that the button has the right text
    expect(button).toHaveTextContent(/edit/i);
  });

  // 11.) Duplicate the test case for edit button if the user is not an admin
  it("should not render edit button if user is not admin", () => {
    const user: User = { id: 1, name: "Mosh" };

    render(<UserAccount user={user} />);

    // 12.) We can't use getByRole because the button won't be in the doc, so we need to use queryByRole because if returns null if the element is not found.
    const button = screen.queryByRole("button");
    // 13.) Verify that the button is not in the doc
    expect(button).not.toBeInTheDocument();
  });
});
