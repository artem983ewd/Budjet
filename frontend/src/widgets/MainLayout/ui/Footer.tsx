import { AppShell, Group, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { footerItems } from "../model/sidebarItems";

export function Footer() {
  const navigate = useNavigate();

  return (
    <AppShell.Footer p="md">
      <Group gap="sm">
        {footerItems.map((item) => (
          <Button
            key={item.path}
            variant="light"
            size="sm"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </Group>
    </AppShell.Footer>
  );
}