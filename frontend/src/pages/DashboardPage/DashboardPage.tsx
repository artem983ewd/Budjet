import { useState } from "react";
import {
  AppShell,
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Button,
} from "@mantine/core";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string | null>("tab1");

  return (
    <AppShell padding="md">
      {/* Основной контент */}

      <Container>
        <Title order={2} mb="md">
          Dashboard
        </Title>
        <Text c="dimmed" mb="xl">
          Welcome to your dashboard
        </Text>

        <Stack gap="md">
          <Card withBorder shadow="sm" p="lg">
            <Title order={4} mb="md">
              {activeTab === "tab1" ? "Tab 1 Content" : "Tab 2 Content"}
            </Title>
            <Text>
              {activeTab === "tab1"
                ? "This is the content for Tab 1. You can see the Footer navigation below."
                : "This is the content for Tab 2. The Footer persists when navigating between tabs."}
            </Text>
          </Card>
        </Stack>
      </Container>

      {/* Футер теперь внутри AppShell */}
      <AppShell.Footer p="md">
        <Container size="md">
          <Group gap="sm">
            <Button
              variant={activeTab === "tab1" ? "filled" : "light"}
              size="sm"
              onClick={() => setActiveTab("tab1")}
            >
              Tab 1
            </Button>
            <Button
              variant={activeTab === "tab2" ? "filled" : "light"}
              size="sm"
              onClick={() => setActiveTab("tab2")}
            >
              Tab 2
            </Button>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
