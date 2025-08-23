// 1.) Type `itr` for import ceremony
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpandableText from "../../src/components/ExpandableText";

// If text is short the full text is shown
// if text is too long it is truncated
// 2.) Create a test suite for ExpandableText component
describe("ExpandableText", () => {
  // 3.) Declare the limit for the characters
  const limit = 255;
  // 4.) Declare the long text that will trigger the truncated version
  const longText = "a".repeat(limit + 1);
  // 5.) Declare the broken down version of the long text
  const truncatedText = longText.substring(0, limit) + "...";

  // 6.) Test case for rendering test that is less than the limit
  it("should render the full text if less than 255 characters", () => {
    // 7.) Declare short text
    const text = "Hello World";
    // 8.) Render the ExpandableText component with test shorter than the limit
    render(<ExpandableText text={text} />);

    // 9.) Verify the text is correct
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  // 10.) Duplicate test case for long text
  it("should truncate text if longer than 255 characters", () => {
    // 11.) Render the component with the long text
    render(<ExpandableText text={longText} />);

    // 12.) Pass the truncatedText to the `qt` and verify that it's in the doc.
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    // Look for the presents of the Show More button

    // 13.) Grab the button w/ with the `qr` snippet
    // We don't need to check if the button is in the doc because, technically, the test would fell on this line if there was no button.
    const button = screen.getByRole("button");

    // 14.) Verify that the word more is in the button
    expect(button).toHaveTextContent(/more/i);
  });

  // 15.) Write test case for expanded text when Show More button is clicked
  it("should expand text when Show More button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    // 16.) Act: Grabbed the button, create a user, and click the button.
    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    // 17.) Verify the long text is in the doc.
    expect(screen.getByText(longText)).toBeInTheDocument();
    // 18.) Verify that now the button should say 'less'
    expect(button).toHaveTextContent(/less/i);
  });

  // 19.) Create a test for the collapsed text
  it("should collapse text when Show Less button is clicked", async () => {
    // 20.) Render the component w/ the long text
    render(<ExpandableText text={longText} />);

    // 21.) Click the Show More button
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    // 22.) Now click the Show Less button
    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    // 23.) Verify the text matches the trucated text and that it's in the doc.
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    // 24.) Verify that the button switched to Show More.
    expect(showMoreButton).toBeInTheDocument();
  });
});
