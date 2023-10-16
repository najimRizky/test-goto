import ApolloProvider from "./providers/ApolloProvider";
import RouterProvider from "./providers/RouterProvider";
import "./styles/variables.css"

function App() {
  return (
    <ApolloProvider>
      <RouterProvider />
    </ApolloProvider>
  );
}

export default App;
