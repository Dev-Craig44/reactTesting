// 1.) Import ceremony
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import ToastDemo from "../../src/components/ToastDemo";

// 2.) Test suite for ToastDemo
describe("ToastDemo", () => {
  // 4.) Create helper function
  const renderToast = async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    // 5.) Start returning props we need
    return {
      // 6.) Grab our button using `qr`, utilize the 2nd parameter
      button: screen.getByRole("button", { name: /toast/i }),
      // 7.) Return our fake user
      user: userEvent.setup(),
    };
  };

  // 3.) Test case: It should render some toast
  it("should render a toast", async () => {
    // 8.) Destructure the helper function and grab our props (ARRANGE)
    const { button, user } = await renderToast();

    // 9.) Click the button, await it, and change the test case to async (ACT)
    await user.click(button);

    // 10.) Use `find`byText because toast comes asynchronously.
    const toast = await screen.findByText(/success/i);

    // 11.) Verify the toast is in the doc.
    expect(toast).toBeInTheDocument();
  });
});
