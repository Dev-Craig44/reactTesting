import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import ReduxProvider from "./ReduxProvider";
import { LanguageProvider } from "./language/LanguageProvider";

// 2.) This is where we keep all of our providers
const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <ReduxProvider>
          <CartProvider>
            <LanguageProvider language="en">
              <Theme>{children}</Theme>
            </LanguageProvider>
          </CartProvider>
        </ReduxProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
};

export default Providers;
