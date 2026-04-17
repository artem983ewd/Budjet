import {
  Anchor,
  Button,
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

export function RegisterPage() {
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
            Create account
          </Title>

          <TextInput
            label="First name"
            placeholder="John"
            required
          />
          <TextInput
            label="Last name"
            placeholder="Doe"
            mt="md"
            required
          />
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            mt="md"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            required
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm password"
            mt="md"
            required
          />

          <Button fullWidth mt="xl" radius="md">
            Register
          </Button>

          <Text ta="center" mt="md" size="sm">
            Already have an account? <Anchor fw={500} component={Link} to="/">Login</Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}