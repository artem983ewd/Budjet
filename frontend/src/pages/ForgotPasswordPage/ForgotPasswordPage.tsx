import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Container,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Center,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
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
            Forgot password?
          </Title>

          <Text ta="center" size="sm" mb="md">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            required
          />

          <Button fullWidth mt="xl" radius="md">
            Send reset link
          </Button>

          <Text ta="center" mt="md" size="sm">
            Remember your password? <Anchor fw={500} component={Link} to="/">Login</Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}