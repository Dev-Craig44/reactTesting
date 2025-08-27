// 1.) typing `itr` for hte ceremony for imports
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

// 2.) Create test case for SearchBox
describe("SearchBox", () => {
  //  4.) Create helper component for our test suite
  const renderSearchBox = () => {
    // 12.) Make mock function for the onChange prop
    const onChange = vi.fn();
    // 5.) Render the SearchBox component w/ a mock function (vi.fn())
    render(<SearchBox onChange={onChange} />);

    // 6.) Return the props we need for our test suite
    return {
      // 7.) Use getByPlaceHolderText() to grab and declare our input. Using this is good because we don't have to query it first and then assert that it has the right placeholder.
      // You can you the shortcut `qp` for this.
      input: screen.getByPlaceholderText(/search/i),
      // 13.) Return our onChange mock function
      onChange,
      // 15.) Grab our mock user
      user: userEvent.setup(),
    };
  };

  // 3.) Create test case for rending an input for searching
  it("should render an input field for searching", () => {
    // 8.) Grab the [input] prop from our helper function
    const { input } = renderSearchBox();
    // 9.) Verify that the [input] is in the doc.
    expect(input).toBeInTheDocument();
  });

  // 10.) Write test case for user interaction
  // 17.) Because the {type} method returns a promise and we are awaiting it, we must make this test case async
  it("should call onChange when Enter is pressed", async () => {
    // 11.) Render the helper function and grab the props we need.
    const { onChange, input, user } = renderSearchBox();

    // 14.) Declare the SearchTerm we want to use
    const searchTerm = "searchTerm";
    // 16.) Use the {type} method on the user object to grab our input and type our searchTerm w/ pressing enter. Await it.
    await user.type(input, `${searchTerm}{enter}`);

    // 18.) Verify that onChange() has been called w/ our [searchTerm]
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  // 19.) Duplicate the last test case to check that the onChange doesn't get called if input field is empty
  it("should not call onChange if input field is empty", async () => {
    const { onChange, input, user } = renderSearchBox();

    // 20.) Erase the [searchTerm] because we don't need it here
    await user.type(input, `{enter}`);

    // 21.) Use the not operate and we st want to verify it's been called
    expect(onChange).not.toHaveBeenCalled();
  });
});
