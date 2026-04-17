import { Title, Text, Card, Stack } from "@mantine/core";

export function Tab1Page() {
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
          Tab 1 Content
        </Title>
        <Text>
          This is the contasdent for Tab 1. You can see the Footer navigation
          below.
        </Text>
      </Card>
    </Stack>
  );
}
