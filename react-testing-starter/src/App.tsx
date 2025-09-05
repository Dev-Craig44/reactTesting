import Layout from "./pages/Layout";
import Providers from "./providers";

function App() {
  return (
    // 1.) This is our custom providers component
    <Providers>
      <Layout />
    </Providers>
  );
}

export default App;
