import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../entities";

const ProductList = () => {
  // 8.) Because useQuery returns an object. Destructure it and grab a few props
  const {
    // 9.) Because the data we have in the component is products, we have to change data into [products] so that it matches
    data: products,
    error,
    isLoading,
    // 5.) Call the Query hook and give it an object w/ two arugments.
    // 11.) To get rid of the typescript error we have to give the shape of our data and the shape of our errors
  } = useQuery<Product[], Error>({
    // 6.) Use queryKey to look up data in the cache
    queryKey: ["products"],
    // 7.) Use queryFn to fetch the data which returns a promise, so we have to use {then} method. Make sure when using the axios.get method you specify what kind of data you expect to get from the backend (<Product[]>)
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  // 12.) Now render the message property on the error message
  if (error) return <div>Error: {error.message}</div>;
  // 10.) Add `!` at the end of [products] because we know what this is, and we don't want to see the type error.
  if (products!.length === 0) return <p>No products available.</p>;

  return (
    <ul>
      {/* 10.) Add `!` at the end of [products] because we know what this is, and we don't want to see the type error. */}
      {products!.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
