import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../entities";

const ProductDetail = ({ productId }: { productId: number }) => {
  // 5.) Destructure the useQuery and grab data (call it [product]), grab the error, and isLoading props
  const {
    data: product,
    error,
    isLoading,
    // 1.) Call useQuery
    // 6.) Give the shape of our errors here <, Error>
  } = useQuery<Product, Error>({
    // 2.) Give it a queryKey pd + pdId
    queryKey: ["products", "productId"],
    // 3.) Add query function to use axios, give the endpoint we used, add the pdId, now use the { then } method to grab the data
    queryFn: () =>
      // 4.) Give the shape of the data <Product>
      axios.get<Product>("/products/" + productId).then((res) => res.data),
  });

  if (!productId) return <div>Invalid productId</div>;

  if (isLoading) return <div>Loading...</div>;

  // 7.) Render the {message} method on the error object
  if (error) return <div>Error: {error.message}</div>;

  if (!product) return <div>The given product was not found.</div>;

  return (
    <div>
      <h1>Product Detail</h1>
      <div>Name: {product.name}</div>
      <div>Price: ${product.price}</div>
    </div>
  );
};

export default ProductDetail;
