import { AppShell, NavLink, Stack, Divider } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react";
import { sidebarItems } from "../model/sidebarItems";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

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
        <Divider my="sm" />
        <NavLink
          label="Выйти"
          leftSection={<IconLogout size={20} />}
          onClick={handleLogout}
          style={{ borderRadius: "var(--mantine-radius-md)" }}
          color="red"
        />
      </Stack>
    </AppShell.Navbar>
  );
}