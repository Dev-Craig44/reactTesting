// 1.) Type `itr` for import ceremony
import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

// 2.) Create test for Taglist component
describe("TagList", () => {
  // 3.) Write a test case for the component redering tags correctly
  it("should render all tags from the list", async () => {
    render(<TagList />);

    // 6.) Use utility function in react testin library called waitFor(). This will continue to keep calling the callback you give it until it times out. The default time is 1000ms. So every 50ms the call back gets called by default. So after one second, if the things we looking for aren't found then our test will fail. Because of this you shouldn't have anything in the code that will cause side effects, otherwise the code that causes side effects will keep getting executed and you get unexpected results.
    // await waitFor(() => {
    //   // 4.) Declare [listItem] using getAllByRole
    //   const listItems = screen.getAllByRole("listitem");
    //   // 5.) Verify that the listItems has more than one item in it.
    //   expect(listItems.length).toBeGreaterThan(0);
    // });

    // 7.) Instead of the previous implementation. Use findByAllRole which is a combination of waitFor and get query
    const listItems = await screen.findAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
