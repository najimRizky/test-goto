import { RouterProvider as ReactRouterProvider, createBrowserRouter } from "react-router-dom"
import BaseLayout from "../layouts/BaseLayout"
import Home from "../pages/Home"
import Error from "../pages/Error"

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }, {
    path: "*",
    element: <Error />
  }
])

const RouterProvider = () => {
  return (
    <ReactRouterProvider router={router} />
  )
}

export default RouterProvider