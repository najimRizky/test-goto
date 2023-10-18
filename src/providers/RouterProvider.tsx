import { RouterProvider as ReactRouterProvider, createBrowserRouter } from "react-router-dom"
import BaseLayout from "../layouts/BaseLayout"
import Home from "../pages/Home"
import Error from "../pages/Error"
import Form from "../pages/Form"
import Detail from "../pages/Detail"

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }, 
      {
        path: "form",
        element: <Form />
      },
      {
        path: ":id",
        element: <Detail />
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