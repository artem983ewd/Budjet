import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Container,
  Group,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Center,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Center mih="100vh" p="md">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="xl"
        style={{
          position: "absolute",
          top: "var(--mantine-spacing-md)",
          right: "var(--mantine-spacing-md)",
        }}
      >
        {computedColorScheme === "dark" ? (
          <IconSun size={20} />
        ) : (
          <IconMoon size={20} />
        )}
      </ActionIcon>

      <Container size="xs" w="100%">
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Title order={2} ta="center" mb="md">
            Welcome back!
          </Title>

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            required
          />

          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" size="sm" />
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" radius="md">
            Login
          </Button>

          <Text ta="center" mt="md" size="sm">
            Don&apos;t have an account? <Anchor fw={500} component={Link} to="/register">Register</Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}