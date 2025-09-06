// This is where we create a React Component
import { PropsWithChildren } from "react";
// 3.) Press CMD + `.` ad click import missing imports to bring in all imports for our logic
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../src/providers/CartProvider";

// 1.) Declare a React Component called [AllProviders], pass it the { children } prop, and annotate it w/ it's type which is PropsWithChildren, this type is defined in React.
const AllProviders = ({ children }: PropsWithChildren) => {
  // 2.) Copy and paste our logic for the React Query here
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // 4.) Instead of rendering, we are going to return this logic because react components return an element or a component tree.
  return (
    <QueryClientProvider client={client}>
      <CartProvider>
        {/* 5.) We replace ProductList with { children } so with this component we can wrap any component as it's children */}
        <Theme>{children}</Theme>
      </CartProvider>
    </QueryClientProvider>
  );
};

// 6.) Export this from this module
export default AllProviders;
