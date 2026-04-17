import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Group, Button, Box } from "@mantine/core";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isTab1 = location.pathname === "/main/dashboard/tab1";
  const isTab2 = location.pathname === "/main/dashboard/tab2";

  return (
    <Box style={{ position: "relative", minHeight: "100vh", paddingBottom: 60 }}>
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
            <Button
              variant={isTab1 ? "filled" : "light"}
              size="sm"
              onClick={() => navigate("/main/dashboard/tab1")}
            >
              Tab 1
            </Button>
            <Button
              variant={isTab2 ? "filled" : "light"}
              size="sm"
              onClick={() => navigate("/main/dashboard/tab2")}
            >
              Tab 2
            </Button>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}