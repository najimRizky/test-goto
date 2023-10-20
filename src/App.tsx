import ApolloProvider from "./providers/ApolloProvider";
import NotificationProvider from "./providers/NotificationProvider";
import RouterProvider from "./providers/RouterProvider";
import "./styles/variables.css"

function App() {
  return (
    <ApolloProvider>
      <NotificationProvider>
        <RouterProvider />
      </NotificationProvider>
    </ApolloProvider>
  );
}

export default App;
