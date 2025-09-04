/* eslint-disable @typescript-eslint/unbound-method */
// 1.) Grab factory and primamaryKey from `mswjs/data`
import { factory, manyOf, oneOf, primaryKey } from "@mswjs/data";
// 2.) Import our faker funnction like last time
import { faker } from "@faker-js/faker/locale/en";

// 3.) Call factory and give it an object. Keys are: Model names & Values are: Model definitions
// This function factory returns a database object which is a in memory database that is shared between our tests. So before our test we can populate it with some data and afterwards clean it up.
export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf("product"),
  },
  // 4.) Create the product model [product]
  product: {
    // 5.) Define [product] giving it a primaryKey and using faker to reference (Don't call it) a unique number.
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    // 6.) Because the price module for the commerce returns a string. Use the number module w/ {int} and give it a range of 1 to 100. Also make it a function so the price doesn't get hard coded in for every product.
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf("category"),
    // Disabled @typescript-eslint/unbound-method because faker passes references to functions (not bound to an object).
    // Without disabling, ESLint complains about potential `this` scoping, but these faker methods don’t rely on `this`.
    // Safe to ignore in this context.
  },
});

export const getProductsByCategory = (categoryId: number) =>
  db.product.findMany({
    where: {
      categoryId: { equals: categoryId },
    },
  });
