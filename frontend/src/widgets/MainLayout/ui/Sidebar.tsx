import { AppShell, NavLink, Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../model/sidebarItems";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell.Navbar p="md">
      <Stack>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={item.icon}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            style={{ borderRadius: "var(--mantine-radius-md)" }}
          />
        ))}
      </Stack>
    </AppShell.Navbar>
  );
}