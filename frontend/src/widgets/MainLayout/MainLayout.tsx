import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Drawer,
  NavLink,
  Stack,
  ActionIcon,
  Divider,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "./model/sidebarItems";
import { IconMoon, IconSun, IconLogout } from "@tabler/icons-react";

export function MainLayout() {
  const [sidebarOpened, setSidebarOpened] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 48em)");

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpened(false);
    }
  };

  const handleBurgerClick = () => {
    if (isMobile) {
      setDrawerOpened(!drawerOpened);
    } else {
      setSidebarOpened(!sidebarOpened);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        {/* justify="space-between" растолкнет элементы: Burger+Text влево, ActionIcon вправо */}
        <Group h="100%" px="md" justify="space-between">
          {/* Левая часть: Бургер и Название */}
          <Group>
            <Burger
              opened={isMobile ? drawerOpened : sidebarOpened}
              onClick={handleBurgerClick}
              size="sm"
            />
            <Text fw={500}>My App</Text>
          </Group>

          {/* Правая часть: Кнопка переключения темы */}
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="lg" // Можно оставить xl, если хочется покрупнее
          >
            {computedColorScheme === "dark" ? (
              <IconSun size={20} />
            ) : (
              <IconMoon size={20} />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      {!isMobile && sidebarOpened && (
        <AppShell.Navbar p="md" withBorder>
          <Stack>
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={item.icon}
                active={location.pathname === item.path}
                onClick={() => handleNavClick(item.path)}
                style={{ borderRadius: "var(--mantine-radius-md)" }}
              />
            ))}
            <Divider my="sm" />
            <NavLink
              label="Выйти"
              leftSection={<IconLogout size={20} />}
              onClick={handleLogout}
              style={{ borderRadius: "var(--mantine-radius-md)" }}
              color="gray"
            />
          </Stack>
        </AppShell.Navbar>
      )}

      {isMobile && (
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          title="Menu"
          padding="md"
          size="xs"
        >
          <Stack>
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={item.icon}
                active={location.pathname === item.path}
                onClick={() => handleNavClick(item.path)}
                style={{ borderRadius: "var(--mantine-radius-md)" }}
              />
            ))}
            <Divider my="sm" />
            <NavLink
              label="Выйти"
              leftSection={<IconLogout size={20} />}
              onClick={handleLogout}
              style={{ borderRadius: "var(--mantine-radius-md)" }}
              color="gray"
            />
          </Stack>
        </Drawer>
      )}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
