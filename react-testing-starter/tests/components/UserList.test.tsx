//  1.) Import { render, screen } using the `itr` shortcut
import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

// 2.) Create the UserList test suite
describe("UserList", () => {
  //  3.) Write test case for if there are no users
  it("should render no users when the users array is empty", () => {
    // 4.) Rander the UserList  component w/ no users
    render(<UserList users={[]} />);

    // 5.) Because <p> don't have a role by default, we need to use getByText
    // Roles are used for interactive elements like, buttons, links, etc.
    expect(screen.getByText(/No users/i)).toBeInTheDocument();
  });

  // 6.) Duplicate the last test case and write test for rendering a list of users
  it("should render a list of users", () => {
    // 7.) Create an array of users
    const users: User[] = [
      { id: 1, name: "Mosh" },
      { id: 2, name: "Craig" },
    ];
    // 8.) Render the UserList component and pass it the list of users
    render(<UserList users={users} />);

    // 9.) iterate over the users list and check if each user is rendered correctly
    users.forEach((user) => {
      // 10.) Use the getByRole to find the link, and use the 2nd argument which is an options object to specify the name of the link
      const link = screen.getByRole("link", { name: user.name });
      // 11.) Verify that the link is in the doc.
      expect(link).toBeInTheDocument();
      // 12.) Verify that the link has the correct href attribute. Look at the production code to see how the href is constructed. Doing this is kind of cheating becuase we shouldn't write our test based on our production code because our production code may have a bug, which could cause false positives in our tests.
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
