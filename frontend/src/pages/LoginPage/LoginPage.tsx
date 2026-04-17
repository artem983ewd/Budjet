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
import { useLoginForm } from "@/features/Auth";

export function LoginPage() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  const { handleSubmit, loading } = useLoginForm();

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

          <form onSubmit={handleSubmit}>
            <TextInput
              name="email"
              label="Email address"
              placeholder="hello@gmail.com"
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              mt="md"
            />

            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" size="sm" />
              <Anchor component={Link} to="/forgot-password" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              radius="md"
              loading={loading}
            >
              Login
            </Button>
          </form>

          <Text ta="center" mt="md" size="sm">
            Don&apos;t have an account?{" "}
            <Anchor fw={500} component={Link} to="/register">
              Register
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}
