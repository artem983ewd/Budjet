import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/Home.page";
import { RegisterPage } from "./pages/Register.page";
import { ForgotPasswordPage } from "./pages/ForgotPassword.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}