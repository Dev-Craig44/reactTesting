// 1.) Do the ceremony of imports
import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

// assert that it renders empty if the DOM is empty
// render this list of images

// 2.) Write test suite for ProductImageGallery
describe("ProductIamgeGallery", () => {
  // 3.) Write test case if the imageUrls is empty
  it("should render nothing if given an empty array", () => {
    // 4.) Render the component with and empty array and store it in a [result] variable
    // 5.) This result object has a property called container which is the root DOM node of the rendered component. Destructure the container from the result object.
    // 6.) Verify that this container is empty using toBeEmptyDOMElement which is a matcher that checks if the DOM node is empty.
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  // 7.) Write next test c  ase that should should render a list of images
  it("should render a list of images", () => {
    // 8.) Declare an array of image URLs
    const imageUrls = ["url1", "url2"];

    // 9.) Render the component w/ the [imageUrls] array
    render(<ProductImageGallery imageUrls={imageUrls} />);

    // Last time we iterated over a list of items, but we can't do that here because you can't filter elements by their source attribute.
    // 10.) Use screen.getAllByRole to get all the images in the doc. This returns an array of all the images
    const images = screen.getAllByRole("img");
    // 11.) Verify that the length of this array is 2 using the toHaveLength matcher
    expect(images).toHaveLength(2);

    // 12.) Iterate over the images array and for each image, verify that it's src attribute is equal to the corresponding URL
    imageUrls.forEach((url, i) => {
      // 13.) Use the toHaveAttribute matcher to verify that the src attribute of the image is equal to the URL
      expect(images[i]).toHaveAttribute("src", url);
    });
  });
});
