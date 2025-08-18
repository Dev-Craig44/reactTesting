import ProductDetail from "../../src/components/ProductDetail";
import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];
ProductDetail;
