import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Group, ActionIcon, Box } from "@mantine/core";
import {
  IconArrowAutofitUp,
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconChartBar,
  IconCreditCard,
  IconHome,
  IconReportMoney,
  IconSettings,
  IconWallet,
} from "@tabler/icons-react";
import { color } from "storybook/theming";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isTab1 = location.pathname === "/main/dashboard/tab1";
  const isTab2 = location.pathname === "/main/dashboard/tab2";

  return (
    <Box
      style={{ position: "relative", minHeight: "100vh", paddingBottom: 60 }}
    >
      <Container style={{ paddingTop: "var(--mantine-spacing-md)" }}>
        <Outlet />
      </Container>

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
          <Group gap="sm">
            <ActionIcon
              variant={isTab1 ? "filled" : "light"}
              color="green"
              size="xl"
              onClick={() => navigate("/main/dashboard/tab1")}
            >
              <IconWallet size={20} />
            </ActionIcon>
            <ActionIcon
              variant={isTab2 ? "filled" : "light"}
              color="green"
              size="xl"
              onClick={() => navigate("/main/dashboard/tab2")}
            >
              <IconArrowUpCircle size={20} />
            </ActionIcon>
            <ActionIcon
              variant={isTab2 ? "filled" : "light"}
              color="green"
              size="xl"
              onClick={() => navigate("/main/dashboard/tab2")}
            >
              <IconArrowDownCircle size={20} />
            </ActionIcon>
            <ActionIcon
              variant={isTab2 ? "filled" : "light"}
              color="green"
              size="xl"
              onClick={() => navigate("/main/dashboard/tab2")}
            >
              <IconReportMoney size={20} />
            </ActionIcon>
            <ActionIcon
              variant={isTab2 ? "filled" : "light"}
              color="green"
              size="xl"
              onClick={() => navigate("/main/dashboard/tab2")}
            >
              <IconChartBar size={20} />
            </ActionIcon>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
