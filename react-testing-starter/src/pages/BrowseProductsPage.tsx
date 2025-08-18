import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../components/CategorySelect";
import ProductSelect from "../components/ProductSelect";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect
          onChange={(categoryId) => setSelectedCategoryId(categoryId)}
        />
      </div>
      <ProductSelect selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
