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
  Divider,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useLoginForm } from "@/features/Auth";
import { googleAuthApi } from "@/features/Auth/api/googleAuth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function GoogleLoginButton() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google token response:', tokenResponse);
      setError(null);
      
      if (!tokenResponse?.access_token) {
        console.error('No access_token in response:', tokenResponse);
        setError('Failed to get Google access token');
        return;
      }
      
      try {
        const response = await googleAuthApi(tokenResponse.access_token);
        console.log('Backend response:', response);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        navigate("/main/dashboard", { replace: true });
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Google login failed';
        console.error("Google login failed:", err);
        setError(message);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      setError('Google authentication failed');
    },
  });

  return (
    <>
      <Button
        variant="default"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => login()}
      >
        Continue with Google
      </Button>
      {error && (
        <Text c="red" ta="center" mt="sm" size="sm">
          {error}
        </Text>
      )}
    </>
  );
}

function LoginPageContent() {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  const { handleSubmit, loading, errors } = useLoginForm();

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
            Welcome back!
          </Title>

          <form onSubmit={handleSubmit}>
            <TextInput
              name="email"
              label="Email address"
              placeholder="hello@gmail.com"
              error={errors.email}
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              mt="md"
              error={errors.password}
            />

            {errors.general && (
              <Text c="red" ta="center" mt="md">
                {errors.general}
              </Text>
            )}

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

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <GoogleLoginButton />

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

export function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
}
