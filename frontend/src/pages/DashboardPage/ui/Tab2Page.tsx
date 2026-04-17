import { Title, Text, Card, Stack } from "@mantine/core";

export function Tab2Page() {
  return (
    <Stack gap="md">
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <Text c="dimmed" mb="xl">
        Welcome to your dashboard
      </Text>
      <Card withBorder shadow="sm" p="lg">
        <Title order={4} mb="md">
          Tab 2 Content
        </Title>
        <Text>
          This is the coasdadsadsadsntent for Tab 2. The Footer persists when
          navigating between tabs.
        </Text>
      </Card>
    </Stack>
  );
}
