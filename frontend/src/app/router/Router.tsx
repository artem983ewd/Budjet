import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "../../pages/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { ForgotPasswordPage } from "../../pages/ForgotPasswordPage";
import { MainLayout } from "../../widgets/MainLayout";
import { DashboardLayout } from "../../pages/DashboardPage/DashboardLayout";
import { IncomePage } from "../../pages/DashboardPage/ui/IncomePage";
import { ExpensesPage } from "../../pages/DashboardPage/ui/ExpensesPage";
import { AccountsPage } from "../../pages/DashboardPage/ui/AccountsPage";
import { DebtsPage } from "../../pages/DashboardPage/ui/DebtsPage";
import { AnalyticsPage } from "../../pages/DashboardPage/ui/AnalyticsPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { SettingsPage } from "../../pages/SettingsPage";

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
  {
    path: "/main",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/main/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="tab1" replace /> },
          { path: "tab1", element: <IncomePage /> },
          { path: "tab2", element: <ExpensesPage /> },
          { path: "accounts", element: <AccountsPage /> },
          { path: "debts", element: <DebtsPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
