import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };

  it("should render an input field for searching", () => {
    const { input } = renderSearchBox();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { onChange, input, user } = renderSearchBox();

    const searchTerm = "searchTerm";
    await user.type(input, `${searchTerm}{enter}`);

    expect(onChange).toHaveBeenCalled();
  });

  it("should not call onChange if input field is empty", async () => {
    const { onChange, input, user } = renderSearchBox();

    await user.type(input, `{enter}`);

    expect(onChange).not.toHaveBeenCalled();
  });
});
