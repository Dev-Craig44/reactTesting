import { describe, it } from "vitest";
import { db } from "./mocks/db";

describe("group", () => {
  it.skip("should", () => {
    const product = db.product.create({ name: "Snow" });
    console.log(db.product.delete({ where: { id: { equals: product.id } } }));
  });
});
