import { Container, Title, Text, Card, Stack, Switch } from "@mantine/core";

export function SettingsPage() {
  return (
    <Container>
      <Title order={2} mb="md">Settings</Title>
      <Text c="dimmed" mb="xl">Manage your preferences</Text>

      <Stack gap="md">
        <Card withBorder shadow="sm" p="lg">
          <Title order={4} mb="md">Appearance</Title>
          <Switch label="Dark mode" defaultChecked />
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Title order={4} mb="md">Notifications</Title>
          <Switch label="Email notifications" defaultChecked />
          <Switch label="Push notifications" mt="sm" />
        </Card>
      </Stack>
    </Container>
  );
}