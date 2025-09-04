import ProductDetail from "../../src/components/ProductDetail";
import { db } from "./db";

export const handlers = [
  // 7.) Instead of manually defining endpoints with http.get() and HttpResponse,

  // we now let MSW Data generate them automatically from our in-memory database models.
  //
  // db.product.toHandlers("rest") → creates a full set of REST endpoints for the Product model:
  //   - GET    /product
  //   - GET    /product/:id
  //   - POST   /product
  //   - PUT    /product/:id
  //   - DELETE /product/:id
  //
  // db.category.toHandlers("rest") → does the same for the Category model.
  //
  // This reduces boilerplate, keeps our mocks consistent with our data models,
  // and makes it easier to maintain as we add more fields or endpoints.
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];
ProductDetail;
