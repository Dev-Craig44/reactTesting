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
  // 7.) Since [id] is typed as string | readonly, explicitly assert it as a string so TypeScript knows we’re aware of its type
  // 8.) Pass the param id to the parseInt method
  const id = parseInt(params.id as string);

  // 5.) Write the logic to look up our product
  // 6.) Because the [id] variable is a string, turn it into a number by using parseInt

  products.find((p) => p.id === parseInt(id));
});
