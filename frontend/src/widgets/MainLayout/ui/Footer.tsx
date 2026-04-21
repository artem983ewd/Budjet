import { AppShell, Group, ActionIcon, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { footerItems } from "../model/sidebarItems";

export function Footer() {
  const navigate = useNavigate();

  return (
    <AppShell.Footer p="md">
      <Group gap="sm" justify="center">
        {footerItems.map((item) => (
          <Tooltip key={item.path} label={item.path.split("/").pop()} position="top">
            <ActionIcon
              variant="light"
              size="lg"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>
    </AppShell.Footer>
  );
}