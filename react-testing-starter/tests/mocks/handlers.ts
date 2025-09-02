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

  // 9.) Switch the parseInt with just the [id] variable and store the value in [product]
  const product = products.find((p) => p.id === id);

  // 10.) Make condition if there is no product
  if (!product) return new HttpResponse(null, { status: 404 });
  // 11.) If we have a product lets just return it
  return HttpResponse.json(product);
});
