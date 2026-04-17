# План: Исправить перекрытие footer и sidebar

## Проблема
`AppShell.Footer` в DashboardLayout создаёт отдельный z-index слой, который перекрывает `AppShell.Navbar` из MainLayout. В Mantine вложенные AppShell конфликтуют.

## Решение
DashboardLayout не должен использовать AppShell. Вместо этого — простой контейнер с position: fixed footer.

## Изменения

### 1. Переписать DashboardLayout.tsx
```tsx
import { useNavigate, Outlet } from "react-router-dom";
import { Container, Group, Button, Box } from "@mantine/core";

export function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <Box style={{ position: "relative", minHeight: "100vh", paddingBottom: 60 }}>
      <Container style={{ paddingTop: "var(--mantine-spacing-md)" }}>
        <Outlet />
      </Container>

      {/* Footer как fixed элемент, но ниже navbar */}
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
          zIndex: 100, // Ниже navbar
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container size="md">
          <Group gap="sm">
            <Button
              variant="light"
              size="sm"
              onClick={() => navigate("/main/dashboard/tab1")}
            >
              Tab 1
            </Button>
            <Button
              variant="light"
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
```

## Ожидаемый результат
- Footer больше не перекрывает sidebar
- Footer визуально отдельный, позиционируется fixed внизу
- Tab контент отображается корректно с отступом снизу
