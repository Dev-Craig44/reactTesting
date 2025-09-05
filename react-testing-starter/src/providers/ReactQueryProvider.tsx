import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  // 3.) Create new QueryClient and store it in a State Variable
  const [queryClient] = useState(() => new QueryClient());

  return (
    // 4.) Pass our [queryClient] to our component that comes from QueryClient component
    // So to use the React Query we have to wrap our components with QueryClientProvider
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
