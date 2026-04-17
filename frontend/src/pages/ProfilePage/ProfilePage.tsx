import { Container, Title, Text, Card, Avatar, Stack, Group } from "@mantine/core";

export function ProfilePage() {
  return (
    <Container>
      <Title order={2} mb="md">Profile</Title>
      <Text c="dimmed" mb="xl">Your profile information</Text>

      <Card withBorder shadow="sm" p="lg">
        <Group>
          <Avatar size="xl" radius="xl" color="blue">
            JD
          </Avatar>
          <Stack gap={4}>
            <Title order={3}>John Doe</Title>
            <Text c="dimmed">john.doe@example.com</Text>
          </Stack>
        </Group>
      </Card>
    </Container>
  );
}