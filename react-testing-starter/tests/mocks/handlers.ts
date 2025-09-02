import { http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "./data";
import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];
ProductDetail;

// 3.) Place this data into the newly created data.ts file and reference it in the {json} method;
http.get("/products", () => {
  return HttpResponse.json(products);
});

// 1.) Define a new request handler
http.get("/products/:id", ({ params }) => {
  // 2.) Destructure this into it's [id] variable
  const { id } = params;

  // 5.) Write the logic to look up our product
  // 6.) Because the [id] variable is a string, turn it into a number by using parseInt
  products.find((p) => p.id === parseInt(id));
});
