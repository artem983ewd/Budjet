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
import { useRegisterForm } from "@/features/Auth";

export function RegisterPage() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { handleSubmit, loading } = useRegisterForm();

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

          <form onSubmit={handleSubmit}>
            <TextInput name="firstName" label="First name" placeholder="John" />
            <TextInput
              name="lastName"
              label="Last name"
              placeholder="Doe"
              mt="md"
            />
            <TextInput
              name="email"
              label="Email address"
              placeholder="hello@gmail.com"
              type="email"
              mt="md"
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              mt="md"
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              mt="md"
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              radius="md"
              loading={loading}
            >
              Register
            </Button>
          </form>

          <Text ta="center" mt="md" size="sm">
            Already have an account?{" "}
            <Anchor fw={500} component={Link} to="/">
              Login
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}
