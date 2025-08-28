// 1.) Import ceremony
import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

// 2.) Create test suite for OrderStatusSelector
describe("OrderStatusSelector", () => {
  // 4.) Create render helper
  const renderComponent = () => {
    // 6.) Create the mock function needed
    const onChange = vi.fn();

    // 5.) Render the component
    render(
      // 7.) Wrap the component in a theme because the component from the library needs ThemeContext to be inside a <Theme> component
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      // 30.) Create a getOption prop for our test suite. It should take the label as an argument and the name of the option should be the label.
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      // 17.) return a function to grab our options, using the `find`AllByRole method to grab the options because the options pop up asynchronously and store them in [getOptions]
      getOptions: () => screen.findAllByRole("option"),
      onChange,
      // 10.) Because our button has a custom role of `combobox` we need to grab that instead of button
      trigger: screen.getByRole("combobox"),
      // 14.) Grab our user
      user: userEvent.setup(),
    };
  };

  // 3.) Create test case for new being the default value
  it("should render new as the default value", () => {
    // 11.) Grab our button from the helper function
    const { trigger } = renderComponent();

    // 12.) Verify that the button has the word `new`
    expect(trigger).toHaveTextContent(/new/i);
  });

  // 13.) Duplicate last test to check for all the right statuses
  it("should render correct statuses", async () => {
    // 15.) Grab our props
    // 18.) Add getOptions to the props
    const { trigger, getOptions, user } = renderComponent();

    // 16.) click the button and verify that it's the new button
    await user.click(trigger);
    expect(trigger).toHaveTextContent(/new/i);

    // 19.) Use our getOptions() prop to declare [options]
    const options = await getOptions();
    // 20.) Verify that we have three options
    expect(options).toHaveLength(3);

    // We encountered an error: “target.hasPointerCapture is not a function”
    // This happens because `hasPointerCapture` is a browser API not available in our Node/jsDOM test environment.
    // Solution: google how to mock or polyfill this API in tests

    // 22.) Map/Iterate over the options and grab their content and store the content in a [labels] variable
    const labels = options.map((options) => {
      // HTLM elements have a prop called textContent.
      return options.textContent;
    });

    // 23.) Verify that the labels equal the new, processed, fulfilled labels
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  // 24.) Create a parameterized test case to select the trigger, selected each options, and verify that it's the correct option value
  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    // 25.) Make the test name Dynamic by using $value and $label
    "should call onChange with $value when the $label option is selected",
    // 26.) Get access to our parameterized props by destructuring the argument of this function, [label, value]
    async ({ label, value }) => {
      // 31.) Import getOption prop into test case
      const { trigger, user, onChange, getOption } = renderComponent();
      await user.click(trigger);

      //  27.) Switch the value of the getOption function to [label]
      const option = await getOption(label);
      await user.click(option);

      // 28.) Switch the hardcoded `processed` to the [value] prop
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  // 29.) Create test case for selecting the new option after selecting another option
  it("should call onChange with 'new' when the New option is selected", async () => {
    const { trigger, user, onChange, getOption } = renderComponent();
    await user.click(trigger);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);
    await user.click(trigger);

    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
