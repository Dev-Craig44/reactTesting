import { http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];
ProductDetail;

http.get("/products", () => {
  return HttpResponse.json([
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ]);
});
