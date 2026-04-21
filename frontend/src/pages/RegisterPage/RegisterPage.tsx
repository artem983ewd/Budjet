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
  Divider,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRegisterForm, googleAuthApi } from "@/features/Auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function GoogleRegisterButton() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'redirect',
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleAuthApi(tokenResponse.id_token);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        navigate("/main/dashboard", { replace: true });
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return (
    <Button
      variant="default"
      fullWidth
      mt="md"
      radius="md"
      onClick={() => login()}
    >
      Continue with Google
    </Button>
  );
}

function RegisterPageContent() {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { handleSubmit, loading, errors } = useRegisterForm();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/main/dashboard", { replace: true });
    }
  }, [navigate]);

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
            <TextInput name="firstName" label="First name" placeholder="John" error={errors.firstName} />
            <TextInput
              name="lastName"
              label="Last name"
              placeholder="Doe"
              mt="md"
              error={errors.lastName}
            />
            <TextInput
              name="email"
              label="Email address"
              placeholder="hello@gmail.com"
              type="email"
              mt="md"
              error={errors.email}
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              mt="md"
              error={errors.password}
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              mt="md"
              error={errors.confirmPassword}
            />

            {errors.general && (
              <Text c="red" ta="center" mt="md">
                {errors.general}
              </Text>
            )}

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

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <GoogleRegisterButton />

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

export function RegisterPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RegisterPageContent />
    </GoogleOAuthProvider>
  );
}
