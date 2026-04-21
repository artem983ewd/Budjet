import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Group, Box, ActionIcon, Tooltip } from "@mantine/core";
import { AddCategoryModal } from "@/features/AddCategory";
import { useCreateCategory } from "@/features/Categories";
import { IconWallet, IconShoppingCart, IconCreditCard, IconReceipt, IconChartBar } from "@tabler/icons-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const createCategory = useCreateCategory();

  const isTab1 = location.pathname === "/main/dashboard/tab1";
  const isTab2 = location.pathname === "/main/dashboard/tab2";
  const isAccounts = location.pathname === "/main/dashboard/accounts";
  const isDebts = location.pathname === "/main/dashboard/debts";
  const isAnalytics = location.pathname === "/main/dashboard/analytics";

  const navItems = [
    { icon: <IconWallet size={22} />, path: "/main/dashboard/tab1", isActive: isTab1, label: "Доходы" },
    { icon: <IconShoppingCart size={22} />, path: "/main/dashboard/tab2", isActive: isTab2, label: "Расходы" },
    { icon: <IconCreditCard size={22} />, path: "/main/dashboard/accounts", isActive: isAccounts, label: "Счета" },
    { icon: <IconReceipt size={22} />, path: "/main/dashboard/debts", isActive: isDebts, label: "Долги" },
    { icon: <IconChartBar size={22} />, path: "/main/dashboard/analytics", isActive: isAnalytics, label: "Аналитика" },
  ];

  const addMainCategory = (name: string, icon: import("@/shared/ui/IconRenderer").IconName, type: "income" | "expense") => {
    createCategory.mutate({ name, type, icon });
  };

  return (
    <Box style={{ position: "relative", minHeight: "100vh", paddingBottom: 60 }}>
      <Container style={{ paddingTop: "var(--mantine-spacing-md)" }}>
        <Outlet />
      </Container>

      <AddCategoryModal addMainCategory={addMainCategory} type={isTab1 ? "income" : "expense"} />

      <Box
        component="footer"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "var(--mantine-color-body)",
          borderTop: "1px solid var(--mantine-color-default-border)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container size="md">
          <Group gap="xs" justify="center">
            {navItems.map((item) => (
              <Tooltip key={item.path} label={item.label} position="top">
                <ActionIcon
                  variant={item.isActive ? "filled" : "light"}
                  size="lg"
                  color={item.isActive ? "blue" : "gray"}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </Container>
      </Box>
    </Box>
  );
}