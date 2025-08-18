import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render all tags from the list", async () => {
    render(<TagList />);

    waitFor(() => {
      const listItem = screen.getAllByRole("listitem");
      expect(listItem.length).toBeGreaterThan(0);
    });
  });
});
