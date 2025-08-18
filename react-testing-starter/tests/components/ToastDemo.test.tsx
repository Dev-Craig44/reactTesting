import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  const renderToast = async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    return {
      button: screen.getByRole("button", { name: /toast/i }),
      user: userEvent.setup(),
    };
  };

  it("should render a toast", async () => {
    const { button, user } = await renderToast();

    await user.click(button);
    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});
